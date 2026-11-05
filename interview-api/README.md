# HIERO Interview API

The AI interview, on its own service. Groq writes the questions from the job
the recruiter posted; the candidate answers them in the portal at
`/interview/:token`; Groq reads the answers back into a report the recruiter
sees on the application.

It is separate from the HIERO gateway on purpose. This is the one part of
Connect that is slow, costs money per request and depends on someone else's
uptime — inside the gateway, a Groq rate limit would take sign-in and the
inbox down with it.

## Running it

```bash
cd interview-api
npm install
cp .env.example .env     # then fill in GROQ_API_KEY, INTERVIEW_SECRET, CONNECT_API_KEY
npm run dev
```

The portal needs to be pointed at it:

```
VITE_INTERVIEW_API_URL=http://localhost:4010
VITE_CONNECT_API_KEY=<the same value as CONNECT_API_KEY here>
```

Without a `GROQ_API_KEY` the service still runs: interviews are asked from a
standard question set and no report is produced. That is for working on the
flow, not for using on real candidates.

## Routes

Recruiter routes need `x-api-key: $CONNECT_API_KEY`. Candidate routes are
authenticated by the token in the link and nothing else.

| Route | Who | What |
| --- | --- | --- |
| `POST /api/interview/invite` | recruiter | Writes the questions, returns the candidate's link |
| `GET /api/interview/session/:token` | candidate | The interview: role, employer, questions, how many are done |
| `POST /api/interview/answer` | candidate | One answer. Re-sending the same one replaces it |
| `POST /api/interview/finish` | candidate | Closes the interview and produces the report |
| `GET /api/interview/report/:applicationId` | recruiter | Scores, strengths, recommendation |
| `POST /api/interview/revoke` | recruiter | Pulls a link back before it is used |
| `GET /health` | — | Model in use and how many sessions are stored |

## The token

The link is the candidate's whole credential: no account, no password. It is
an HMAC-signed payload carrying its own expiry, so it survives a restart
without a lookup and cannot be forged. Change `INTERVIEW_SECRET` and every
outstanding link stops working.

## Where the answers go

The transcript is stored here. It is never returned by the recruiter-facing
report — that gives back scores, strengths, a recommendation and a summary.
The audio is never uploaded at all: the portal transcribes in the browser and
sends text, so there is no recording to keep, leak or promise to delete.

## Storage

One JSON file under `data/`, held in memory and rewritten after each change.
That is the right size for a few hundred interviews of a page each. Moving to
Postgres is a morning's work in `src/store.js` when the volume asks for it.

## Changing the model

`GROQ_MODEL` in `.env`. The default is `llama-3.3-70b-versatile`. Groq's
catalogue moves — if a call comes back saying the model is unknown, check
<https://console.groq.com/docs/models>; `openai/gpt-oss-120b` is the usual
replacement. Both prompts ask for JSON and the code falls back when it does
not get it, so a model swap is low-risk.
