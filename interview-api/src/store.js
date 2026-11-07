import fs from 'node:fs';
import path from 'node:path';
import { MongoClient } from 'mongodb';
import { config } from './config.js';

// ============================================================
// Where the interviews live
// ============================================================
// This used to be one JSON file on disk, on the reasoning that a few hundred
// interviews do not need a database. The reasoning was sound and the place
// was wrong: on Render's free plan the disk is thrown away every time the
// service restarts, and the service restarts on its own after fifteen idle
// minutes. So a candidate who opened their link, listened to the question
// and spoke their answer was told "that answer could not be saved" — the
// interview they were halfway through no longer existed.
//
// Nothing about that is visible in testing, because testing keeps the
// service awake.
//
// So sessions go to the MongoDB the gateway already uses. Each one is its own
// document keyed by its jti: they are written independently, often while two
// candidates are answering at once, and a single document holding all of them
// would have them overwriting each other.
//
// Reads still come from memory, so every caller stays synchronous — the
// difference is that memory is now filled from Mongo at boot instead of from
// a file that is no longer there.
//
// With no MONGODB_URI set it falls back to the JSON file, which is right for
// a laptop with no database to hand.

const COLLECTION = 'interview_sessions';

// A finished interview is worth keeping while the recruiter might still open
// the report, and worth nothing after that. Mongo expires them itself.
const KEEP_DAYS = 60;

let sessions = new Map();
let collection = null;

// ── The file, for a laptop with no Mongo ────────────────────

function loadFile() {
  try {
    const raw = fs.readFileSync(config.dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    sessions = new Map(Object.entries(parsed.sessions || {}));
  } catch {
    // No file yet, or it was left unreadable. Starting empty is right: the
    // alternative is refusing to boot over a file we are about to rewrite.
    sessions = new Map();
  }
}

let writeQueued = false;
function flushFile() {
  if (writeQueued) return;
  writeQueued = true;
  // Collected on the next tick so a burst of answers costs one write.
  setImmediate(() => {
    writeQueued = false;
    const payload = JSON.stringify({ sessions: Object.fromEntries(sessions) }, null, 2);
    const tmp = `${config.dataFile}.tmp`;
    try {
      fs.mkdirSync(path.dirname(config.dataFile), { recursive: true });
      // Written beside the real file and renamed over it, so a crash
      // mid-write cannot leave half a file where the interviews used to be.
      fs.writeFileSync(tmp, payload);
      fs.renameSync(tmp, config.dataFile);
    } catch (err) {
      console.error('[store] could not save sessions:', err.message);
    }
  });
}

// ── Mongo ───────────────────────────────────────────────────

async function connect() {
  const client = new MongoClient(config.mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });
  await client.connect();
  const db = client.db(config.mongoDb || undefined);
  collection = db.collection(COLLECTION);

  await collection
    .createIndex({ savedAt: 1 }, { expireAfterSeconds: KEEP_DAYS * 86400 })
    .catch(() => {});
  await collection.createIndex({ applicationId: 1, createdAt: -1 }).catch(() => {});

  const rows = await collection.find({}).toArray();
  sessions = new Map(rows.map(row => {
    // _id is Mongo's, jti is ours; they hold the same value and only one of
    // them belongs in the object the routes read.
    const { _id, savedAt, ...session } = row;
    return [session.jti, session];
  }));

  console.log(`[store] MongoDB — ${sessions.size} session${sessions.size === 1 ? '' : 's'} recovered`);
}

// One write at a time per session, and never more than one queued.
//
// Writing the whole document means two writes for the same interview must
// not overlap: opening the link and answering the first question happen
// within a second of each other, and if the slower one lands second it
// writes back the state from before the answer. That is how the answer
// quietly disappears — the request said success, because it did succeed,
// against a copy that was then overwritten.
//
// So a write in flight marks the session dirty instead of starting a second
// one, and the write that follows takes whatever is in memory at the time it
// runs. A burst of answers therefore costs one or two writes, not six, and
// the last one always reflects the latest state.
const inFlight = new Map();
const dirty = new Set();

/**
 * Not awaited by the routes: a candidate who has just finished speaking
 * should not be watching a spinner while a database in another region
 * acknowledges the write. The in-memory copy is updated first, so the reply
 * is honest either way, and a failure is logged rather than swallowed.
 *
 * Where losing the write would matter — the finished report — the route
 * awaits `settled` below.
 */
function save(jti) {
  if (!collection) return flushFile();
  dirty.add(jti);
  if (inFlight.has(jti)) return;

  const drain = (async () => {
    while (dirty.has(jti)) {
      dirty.delete(jti);
      const session = sessions.get(jti);
      if (!session) break;
      try {
        await collection.replaceOne(
          { _id: jti },
          { ...session, _id: jti, savedAt: new Date() },
          { upsert: true }
        );
      } catch (err) {
        console.error('[store] could not save session:', err.message);
        break;
      }
    }
    inFlight.delete(jti);
  })();

  inFlight.set(jti, drain);
}

/**
 * Resolves once the sessions already in progress are back in memory.
 *
 * The server waits on this before it accepts a request. Serving during the
 * half second of hydration would mean answering "this interview does not
 * exist" to someone holding a perfectly good link — which is the failure
 * this whole file exists to stop, arriving a different way.
 */
export const ready = (async () => {
  if (!config.mongoUri) {
    loadFile();
    console.log('[store] No MONGODB_URI — sessions kept in data/sessions.json.');
    console.log('[store] On a host with an ephemeral disk they will not survive a restart.');
    return;
  }
  try {
    await connect();
  } catch (err) {
    // Refusing to boot would take down a service whose other half — writing
    // questions, reading them aloud — works perfectly well. Falling back to
    // the file keeps interviews running until Mongo is reachable again.
    console.error('[store] MongoDB unreachable:', err.message);
    console.error('[store] Falling back to data/sessions.json for this run.');
    collection = null;
    loadFile();
  }
})();

export const store = {
  get(jti) {
    return sessions.get(jti) || null;
  },

  put(session) {
    sessions.set(session.jti, session);
    save(session.jti);
    return session;
  },

  update(jti, change) {
    const existing = sessions.get(jti);
    if (!existing) return null;
    const next = { ...existing, ...change };
    sessions.set(jti, next);
    save(jti);
    return next;
  },

  /** The most recent interview sent against an application. */
  latestForApplication(applicationId) {
    let latest = null;
    for (const session of sessions.values()) {
      if (session.applicationId !== applicationId) continue;
      if (!latest || new Date(session.createdAt) > new Date(latest.createdAt)) latest = session;
    }
    return latest;
  },

  count() {
    return sessions.size;
  },

  /**
   * Resolves once this session's pending writes have landed.
   *
   * For the one place where losing a write is not recoverable: the report is
   * written once, when the candidate finishes, and nobody is going to come
   * back and produce it again.
   */
  async settled(jti) {
    while (inFlight.has(jti)) await inFlight.get(jti);
  },

  /** What the health check reports, so a wrong answer is visible there. */
  durable() {
    return Boolean(collection);
  },
};
