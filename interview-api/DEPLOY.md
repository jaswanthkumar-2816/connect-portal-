# Deploying the interview

Two halves. Vercel on its own does nothing — the portal page calls this
service, so the service has to exist first.

---

## 1. Render — the interview service

New **Web Service**, from the `connect-portal-` repository.

| Setting | Value |
|---|---|
| Root directory | `interview-api` |
| Build command | `npm install` |
| Start command | `npm start` |
| Instance | Free is enough to try it — read the warnings at the bottom first |

### Environment variables

| Name | Value | Why |
|---|---|---|
| `GROQ_API_KEY` | the key from the gateway's `.env` | Writes the questions, reads the answers |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | **Do not leave this out.** The default in the code is `llama-3.3-70b-versatile`, which Groq has retired — it 404s, and the failure is silent: answers save, questions fall back to a standard set, and the report says the assessment could not be produced. No scores, nothing obviously broken on screen. |
| `INTERVIEW_SECRET` | `openssl rand -hex 32` | Signs the invite tokens, which are the candidate's whole credential. Changing it later invalidates every outstanding link. |
| `CONNECT_API_KEY` | `openssl rand -hex 32`, a different one | Server-to-server callers only — scripts, cron. Never goes anywhere near the browser. |
| `HIERO_GATEWAY_URL` | `https://hiero.in` | Recruiter tokens are checked against the gateway that issued them |
| `PORTAL_URL` | `https://connect.hiero.in` | The candidate's link is built on this |
| `ALLOWED_ORIGINS` | `https://connect.hiero.in` | Which browsers may call this service |
| `QUESTION_COUNT` | `8` | Optional; 8 is the default |

---

## 2. Vercel — point the portal at it

**Settings → Environment Variables:**

| Name | Value |
|---|---|
| `VITE_INTERVIEW_API_URL` | the Render URL, e.g. `https://hiero-interview-api.onrender.com` |

Then **redeploy**. Vite compiles `VITE_` variables into the bundle at build
time, so setting the variable alone changes nothing until a build runs.

**Leave `VITE_CONNECT_API_KEY` empty.** It is in `.env.example` and the portal
will send it as `x-api-key` if it is set. That key is the interview service's
trusted-caller key — it mints interviews and reads assessments and is not
scoped to one company. Everything prefixed `VITE_` is compiled into the bundle
every candidate downloads, so setting it hands all of that to anyone who opens
the page. A signed-in recruiter does not need it; their own token already says
who they are.

`VITE_CONNECT_INTERVIEW` defaults to true and does not need setting.

---

## Check it worked

```bash
curl https://<your-render-url>/health
```

Then send yourself an interview from the portal inbox and open the link.

---

## Three things to know before real candidates use it

**Sessions are stored in a file on disk.** `data/sessions.json`. Render's
filesystem does not survive a deploy, so every deploy throws away interviews in
progress and the reports of finished ones. This is the same fault that was
quietly wiping jobs and applications on the gateway for weeks. For a demo it is
survivable. Before this matters to anyone, the sessions belong in MongoDB
alongside everything else, or on a Render persistent disk.

**A free instance sleeps.** After about fifteen minutes idle, the next request
wakes it and waits roughly fifty seconds. The first candidate of the day opens
the link, sees nothing happen, and closes it. If your brother is sending this to
real applicants, this is the one worth paying for.

**The voice runs here.** Kokoro-82M is downloaded on first start — about 90MB —
and generates speech on the instance rather than per-request from a paid API.
That is cheap but not free of memory: if the service restarts or runs out of
memory on a small instance, set `VOICE_ENABLED=false` and the candidate's own
browser reads the questions instead. It sounds worse, especially on a cheap
Android, but it works.
