// Shared brand mark — a 2x2 grid of line icons (leaf, whisk, measuring cup, open book),
// matching the "Mise en Place" brand board. Used in Header, Footer, and Hero at different sizes.

const OLIVE = '#5C6B47'
const TERRACOTTA = '#B85C38'
const BOOK_BROWN = '#8B6F3E'

type LogoMarkProps = {
  size?: number
  // dark = no fill of its own — lets whatever it's placed on show through
  //        (Header, Footer, or any other dark-ish surface)
  // light = white fill with a black outline, for use on light/cream sections (Hero)
  mode?: 'dark' | 'light'
  // Optional override for width/height — e.g. { width: 'auto', height: '100%' } to
  // have the mark stretch to fill a container's height instead of using a fixed
  // pixel size. Merged over (and takes priority over) the size-based defaults.
  style?: React.CSSProperties
}

export default function LogoMark({ size = 32, mode = 'dark', style }: LogoMarkProps) {
  // No fill in either mode — the mark always lets whatever surface it sits on
  // (cream Hero, olive Header, charcoal Footer, etc.) show through. Only the
  // outline/dividers and the icons themselves are drawn.
  const line = mode === 'dark' ? '#F3EDE4' : '#21201D'
  const whisk = mode === 'dark' ? '#F3EDE4' : '#21201D'
  const rx = mode === 'dark' ? 20 : 10
  const borderWidth = mode === 'dark' ? 1.5 : 3
  // Dark mode can sit on either the olive header or the charcoal footer — a plain
  // olive leaf would vanish on an olive background, so use a lighter, brighter
  // green there instead. Light mode keeps the true brand olive.
  const leaf = mode === 'dark' ? '#97C459' : OLIVE

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
      <rect x="2" y="2" width="96" height="96" rx={rx} fill="none" stroke={borderWidth ? line : 'none'} strokeWidth={borderWidth} />
      <line x1="50" y1="10" x2="50" y2="90" stroke={line} strokeWidth={mode === 'dark' ? 1.5 : 2} />
      <line x1="10" y1="50" x2="90" y2="50" stroke={line} strokeWidth={mode === 'dark' ? 1.5 : 2} />

      {/* Each icon is drawn in its own local 0–24 box, then placed in its quadrant.
          Left column = x18, right column = x58, top row = y18, bottom row = y58 —
          identical inset (18) from each quadrant's edge, so the grid is symmetric. */}

      {/* Leaf — top left */}
      <g transform="translate(18, 18)">
        <path d="M12 1C6 3 2 8 2 14c0 4 3 8 8 8 5-3 8-9 8-15 0-4-3-6-6-6z" stroke={leaf} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 22C4 15 7 9 15 4" stroke={leaf} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Whisk — top right */}
      <g transform="translate(58, 18)">
        <line x1="12" y1="0" x2="12" y2="9" stroke={whisk} strokeWidth="2" strokeLinecap="round" />
        <path d="M5 9c0 7 3 12 7 14 4-2 7-7 7-14" stroke={whisk} strokeWidth="2" strokeLinecap="round" />
        <path d="M8 9c0 6 1.5 10 4 12.5" stroke={whisk} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 9c0 6-1.5 10-4 12.5" stroke={whisk} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Measuring cup — bottom left */}
      <g transform="translate(18, 58)">
        <path d="M4 5h14l-2.5 16a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L4 5z" stroke={TERRACOTTA} strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 8c2.5 0.8 3.3 2.6 2.5 5s-3.3 3.3-5 2.5" stroke={TERRACOTTA} strokeWidth="1.7" strokeLinecap="round" />
        <line x1="5.5" y1="10" x2="16.5" y2="10" stroke={TERRACOTTA} strokeWidth="1.3" />
      </g>

      {/* Open book — bottom right, both halves equal width for true symmetry */}
      <g transform="translate(58, 58)">
        <path d="M12 3C9.5 1.3 5.5 0.5 2 1.2v17.6c3.5-0.7 7.5 0.1 10 1.8V3z" stroke={BOOK_BROWN} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 3c2.5-1.7 6.5-2.5 10-1.8v17.6c-3.5-0.7-7.5 0.1-10 1.8V3z" stroke={BOOK_BROWN} strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
