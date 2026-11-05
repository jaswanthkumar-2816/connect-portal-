import { useEffect, useRef } from 'react';

// ============================================================
// The interviewer
// ============================================================
// The clip is 9:16, so it is not decoration on the page — it IS the page.
// The candidate is looking at a person across a desk, and the questions and
// controls sit over the top of her, the way a video call does.
//
// Three states, three clips of the same recording: she listens while the
// candidate talks, speaks while the question is read, and thanks them at the
// end. They are cut together live, in the same frame, so they have to be the
// same person in the same light — a shift between them reads as a glitch, and
// a candidate who notices a glitch stops believing the interview.
//
// Two honest constraints shape this:
//
// It is labelled. The person on screen is generated, and a candidate must
// never be left thinking a human is watching them — that would change what
// they say, and it would be a lie told at the worst possible moment. The
// badge is not decoration and should not be removed.
//
// It is muted, always. The clips carry their own audio; the questions come
// from the interview service. Two voices at once is no voice at all.

const POSTER = '/interview/interviewer-poster.jpg';

const CLIPS = {
  listening: '/interview/listening.mp4',
  asking: '/interview/asking.mp4',
  thanks: '/interview/thanks.mp4',
} as const;

type Mood = keyof typeof CLIPS;

export default function Interviewer({
  speaking,
  finished = false,
}: {
  speaking: boolean;
  finished?: boolean;
}) {
  const mood: Mood = finished ? 'thanks' : speaking ? 'asking' : 'listening';

  const listening = useRef<HTMLVideoElement | null>(null);
  const asking = useRef<HTMLVideoElement | null>(null);
  const thanks = useRef<HTMLVideoElement | null>(null);

  // Only the clip on screen decodes. Three videos playing at once on a cheap
  // phone costs battery and frames for two pictures nobody can see.
  useEffect(() => {
    const all: [Mood, HTMLVideoElement | null][] = [
      ['listening', listening.current],
      ['asking', asking.current],
      ['thanks', thanks.current],
    ];
    for (const [name, el] of all) {
      if (!el) continue;
      if (name === mood) {
        // The talking clips start from the top each time, so a question never
        // opens on her mid-sentence from the last one.
        if (name !== 'listening') el.currentTime = 0;
        // Autoplay is refused often enough — a data saver, low power mode, a
        // browser that wants a gesture first — that it cannot be left to the
        // attribute alone. A refusal is survivable: the poster frame holds,
        // which is a photograph of the same person.
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [mood]);

  const clip = (name: Mood, ref: typeof listening) => (
    <video
      key={name}
      ref={ref}
      src={CLIPS[name]}
      poster={POSTER}
      muted
      loop={name !== 'thanks'}       // the closing clip plays once and holds
      playsInline
      // listening and asking swap repeatedly through the interview, so both
      // are fetched up front; the closing clip is not mounted until it is
      // needed, which keeps roughly three megabytes off a phone's data until
      // the interview is actually finished.
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      style={{
        objectFit: 'cover',
        objectPosition: 'center 28%',
        opacity: mood === name ? 1 : 0,
        transition: 'opacity 220ms ease',
      }}
    />
  );

  return (
    <>
      {clip('listening', listening)}
      {clip('asking', asking)}
      {finished && clip('thanks', thanks)}

      {/* Everything on this page is white text on an office that is mostly
          white. Without these the interview is unreadable, so they are part
          of the layout rather than a finishing touch. */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '34%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '68%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 32%, rgba(0,0,0,0.45) 68%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* She has the floor. A thin line of colour is enough to say so, and
          it does not cover her face to do it. */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 2,
          background: 'var(--color-accent)',
          opacity: speaking ? 1 : 0,
          transition: 'opacity 240ms ease',
          animation: speaking ? 'glowPulse 2s ease-in-out infinite' : 'none',
        }}
      />
    </>
  );
}
