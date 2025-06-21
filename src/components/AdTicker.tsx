import styled, { keyframes } from 'styled-components';

/* ── slide animation ─────────────────────────────── */
const slide = keyframes`
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

/* ── banner shell ────────────────────────────────── */
const Bar = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #111;          /* banner background  */
  color: #fff;
  font-size: .9rem;
  height: 36px;
  display: flex;
  align-items: center;
  /* soft fade on edges */
  mask-image: linear-gradient(to right, transparent 0, #000 4%, #000 96%, transparent 100%);
`;

/* ── strip that moves ────────────────────────────── */
const Track = styled.div`
  display: flex;
  gap: 3rem;                 /* space between messages */
  white-space: nowrap;
  animation: ${slide} 18s linear infinite;
`;

/* ── single message style (customise freely) ─────── */
const Msg = styled.span`
  display: flex;
  align-items: center;
  gap: .5rem;

  &::after {                 /* small separator dot */
    content: '•';
    font-size: 1.2rem;
    line-height: 0;
    opacity: .4;
  }
  &:last-child::after { display: none; }
`;

export default function AdTicker() {
  /* Any messages you like (links optional) */
  const ads = [
    "Hand‑crafted furniture · Delivered worldwide",
    "Free design consult with every order",
    "Sustainably sourced oak & walnut",
    "Vogue: “Grande&Co sets the bar in modern minimalism”"
  ];

  return (
    <Bar>
      <Track>
        {/* repeat once to ensure seamless loop */}
        {[...ads, ...ads].map((text, i) => (
          <Msg key={i}>{text}</Msg>
        ))}
      </Track>
    </Bar>
  );
}
