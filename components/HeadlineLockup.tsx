import type { ReactNode } from 'react';

/* The hand-drawn "actual size" annotation. Only the real h1 carries it: the echo
   ghosts are typography alone, so the joke lands once. */
const Note = () => (
  <span className="small-note" aria-hidden="true">
    <svg viewBox="0 0 62 30">
      <path pathLength={1} d="M58,22 C44,10 28,7 10,13 M10,13 l9,-6 M10,13 l10,4" />
    </svg>
    <span className="txt">actual size</span>
  </span>
);

/* The one place the hero headline copy lives. The h1 wraps each line in the clip
   mask the intro hands off to, the echo layer renders the same three lines flat,
   and neither can drift from the other. */
export default function HeadlineLockup({
  wrap,
  note = false,
}: {
  wrap: (line: ReactNode, i: number) => ReactNode;
  note?: boolean;
}) {
  const lines: ReactNode[] = [
    <>
      We make <span className="word-small">small{note ? <Note /> : null}</span>
    </>,
    <>business</>,
    <>
      look <span className="word-huge">huge.</span>
    </>,
  ];
  return <>{lines.map((line, i) => wrap(line, i))}</>;
}
