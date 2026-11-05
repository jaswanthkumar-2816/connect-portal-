# Interviewer clips — generation prompts

Three clips for the Connect interview, plus the one that already exists
(`public/interview/interviewer.mp4`).

They are cut together live, in the same frame, while the candidate is looking
at them. So the thing that matters most is not how good any one clip is — it
is that all three look like **the same continuous recording of the same
person**. A shift in hair, light or camera height between states reads as a
glitch, and a candidate who notices a glitch stops believing the interview.

Everything below is built on the existing clip. Keep the **Subject and set**
block identical in all three prompts.

---

## Subject and set — paste this into every prompt

> A South Asian woman in her late twenties, seated at a white desk in a bright
> modern office, facing the camera straight on. Long dark brown wavy hair
> parted slightly off-centre, falling over both shoulders. A charcoal tailored
> blazer over a cream silk top. A fine gold chain with a small pendant, small
> gold stud earrings. Hands resting on the desk in front of her, fingers
> loosely interlaced. An open silver laptop at the left edge of frame, a closed
> notebook with a black pen at the right. Behind her: a white wall, built-in
> shelving on the right holding books and small objects lit by a warm LED
> strip, and a large green tropical plant on the left. A dark grey office chair
> behind her. Soft diffused daylight from the front left. Shallow depth of
> field, background gently out of focus.

**Camera, in all three:** locked off on a tripod, no pan, no zoom, no push in,
no handheld drift. Vertical 9:16, 1080×1920. Framed from mid-torso up, her eyes
about a third of the way down the frame. Single continuous take, no cuts.

**Why the camera must not move:** the clips swap mid-interview. If one drifts
and the next does not, she appears to jump.

---

## 1. Listening

Plays while the candidate is talking. This is on screen longest, so it has to
survive being watched.

> A South Asian woman in her late twenties, seated at a white desk in a bright
> modern office, facing the camera straight on. Long dark brown wavy hair parted
> slightly off-centre, falling over both shoulders. A charcoal tailored blazer
> over a cream silk top. A fine gold chain with a small pendant, small gold stud
> earrings. Hands resting on the desk in front of her, fingers loosely
> interlaced. An open silver laptop at the left edge of frame, a closed notebook
> with a black pen at the right. Behind her: a white wall, built-in shelving on
> the right holding books and small objects lit by a warm LED strip, and a large
> green tropical plant on the left. A dark grey office chair behind her. Soft
> diffused daylight from the front left. Shallow depth of field, background
> gently out of focus. Locked-off tripod camera, no pan, no zoom, no drift.
> Vertical 9:16, framed from mid-torso up, single continuous take.
>
> She is listening attentively to someone just off camera. Calm and warm. Her
> eyes stay on the lens. Occasional natural blinking, one small nod of
> understanding, the faintest encouraging smile that comes and goes. Her mouth
> stays closed throughout — she is not speaking. Tiny natural shifts in posture
> and breathing, nothing more. Unhurried and still.

- **Length:** 10–15 seconds
- **Must loop seamlessly.** Begin and end in the same neutral pose — eyes on
  lens, mouth closed, hands as described — so the join is invisible.
- Do not let her look away, check a screen, or glance at notes. The candidate
  reads that as being ignored.

## 2. Asking a question

Plays while the question is read out.

> A South Asian woman in her late twenties, seated at a white desk in a bright
> modern office, facing the camera straight on. Long dark brown wavy hair parted
> slightly off-centre, falling over both shoulders. A charcoal tailored blazer
> over a cream silk top. A fine gold chain with a small pendant, small gold stud
> earrings. Hands resting on the desk in front of her, fingers loosely
> interlaced. An open silver laptop at the left edge of frame, a closed notebook
> with a black pen at the right. Behind her: a white wall, built-in shelving on
> the right holding books and small objects lit by a warm LED strip, and a large
> green tropical plant on the left. A dark grey office chair behind her. Soft
> diffused daylight from the front left. Shallow depth of field, background
> gently out of focus. Locked-off tripod camera, no pan, no zoom, no drift.
> Vertical 9:16, framed from mid-torso up, single continuous take.
>
> She is speaking to the person across the desk, asking a question in a warm,
> conversational way. Natural mouth movement, relaxed and unhurried. Light
> eyebrow movement and one small open-handed gesture, then hands return to the
> desk. Friendly and interested, not stern. Eyes on the lens throughout.

- **Length:** 8–12 seconds, looping
- Start and end in the same neutral pose as the listening clip, so either can
  follow either.

**Read this before generating it.** The words the candidate hears are spoken by
the text-to-speech voice, not by the video. Her lips will not match the words.
Big, crisp mouth movement makes that mismatch obvious and the whole thing looks
dubbed. Ask for **soft, understated mouth movement**, and favour a take where
her head is turned very slightly rather than square to camera — the mismatch
reads far less at a slight angle. If it still looks wrong, the honest fallback
is to use the listening clip for both states and let the on-screen question
text carry it.

## 3. Thank you — the end of the interview

Plays once on the finishing screen.

> A South Asian woman in her late twenties, seated at a white desk in a bright
> modern office, facing the camera straight on. Long dark brown wavy hair parted
> slightly off-centre, falling over both shoulders. A charcoal tailored blazer
> over a cream silk top. A fine gold chain with a small pendant, small gold stud
> earrings. Hands resting on the desk in front of her, fingers loosely
> interlaced. An open silver laptop at the left edge of frame, a closed notebook
> with a black pen at the right. Behind her: a white wall, built-in shelving on
> the right holding books and small objects lit by a warm LED strip, and a large
> green tropical plant on the left. A dark grey office chair behind her. Soft
> diffused daylight from the front left. Shallow depth of field, background
> gently out of focus. Locked-off tripod camera, no pan, no zoom, no drift.
> Vertical 9:16, framed from mid-torso up, single continuous take.
>
> She gives a warm, genuine closing smile and a single slow nod of thanks, as
> if a conversation has just ended well. Her expression softens. Mouth mostly
> closed — a brief, warm "thank you" shape at most. She holds the warm
> expression at the end rather than returning to neutral.

- **Length:** 5–8 seconds
- **Does not loop** — it plays once and holds on the last frame.
- Keep this one nearly silent in its mouth movement. It plays under written
  words, and a long spoken sentence with no matching audio is the most obvious
  mismatch of the three.

---

## What she is thanking them for

The page says it; the clip only has to carry the warmth. Current copy on the
finished screen:

> **That is everything**
> Your answers have gone to {company}. They will be in touch about what
> happens next — you can close this page.
> *Thank you for taking the time.*

If it is spoken by the text-to-speech voice instead, this is the line:

> "That's everything — thank you for taking the time. Your answers are with
> the team now, and they'll get back to you about what happens next."

Deliberately no timeline. "We'll be in touch within a week" is a promise a
salon owner has not made and may not keep, and the candidate will hold the
interview to it.

---

## Technical

| | |
|---|---|
| Format | MP4, H.264 |
| Aspect | 9:16 vertical, 1080×1920 |
| Frame rate | 30fps, same across all three |
| Audio | None needed. The page mutes the video always — the question audio comes from the interview service, and two voices at once is no voice at all. |
| File size | Aim at or below the existing clip (~2.7MB). Candidates open this on phone data. |
| Where they go | `public/interview/` — `listening.mp4`, `asking.mp4`, `thanks.mp4`, plus a poster JPG for each |

**Negative prompt, all three:** no camera movement, no zoom, no cuts, no text
or captions, no watermark, no other people, no hands near the face, no drastic
lighting change, no change of clothing or hairstyle, no looking away from
camera.

---

## When the files exist

`Interviewer.tsx` already takes a `speaking` prop and currently ignores it —
there is one clip. Swapping between listening and asking is a small change at
that point, and the finishing screen needs the thank-you clip adding. Worth
preloading all three at the start: a clip that arrives late shows a blank frame
at the exact moment the interview is meant to feel like a person.
