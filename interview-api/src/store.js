import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

// ============================================================
// Where the interviews live
// ============================================================
// One JSON file, held in memory and written out after every change. That is
// enough for what this is: a few hundred interviews, each a page of text,
// read far more often than written.
//
// It is deliberately not a database. Swapping this file for Postgres is a
// morning's work when the volume asks for it; carrying a database from the
// first day for a service that answers a handful of requests an hour is a
// cost paid every day for a problem nobody has yet.

let sessions = new Map();

function load() {
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
function flush() {
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

load();

export const store = {
  get(jti) {
    return sessions.get(jti) || null;
  },

  put(session) {
    sessions.set(session.jti, session);
    flush();
    return session;
  },

  update(jti, change) {
    const existing = sessions.get(jti);
    if (!existing) return null;
    const next = { ...existing, ...change };
    sessions.set(jti, next);
    flush();
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
};
