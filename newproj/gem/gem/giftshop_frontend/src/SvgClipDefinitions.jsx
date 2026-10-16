export default function SvgClipDefinitions() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        {/* 1. Mathematically Centered & Symmetric Heart Shape (0 to 1 normalized coordinate space) */}
        <clipPath id="svg-mask-heart" clipPathUnits="objectBoundingBox">
          <path d="M 0.5,0.88 C 0.5,0.88 0.05,0.58 0.05,0.32 C 0.05,0.12 0.22,0.04 0.38,0.04 C 0.46,0.04 0.5,0.1 0.5,0.16 C 0.5,0.1 0.54,0.04 0.62,0.04 C 0.78,0.04 0.95,0.12 0.95,0.32 C 0.95,0.58 0.5,0.88 0.5,0.88 Z" />
        </clipPath>

        {/* 2. TN Vehicle Plate Shield Tag */}
        <clipPath id="svg-mask-shield" clipPathUnits="objectBoundingBox">
          <path d="M 0.5,0.02 L 0.96,0.12 L 0.96,0.65 C 0.96,0.82 0.5,0.98 0.5,0.98 C 0.5,0.98 0.04,0.82 0.04,0.65 L 0.04,0.12 Z" />
        </clipPath>

        {/* 3. Hexagon */}
        <clipPath id="svg-mask-hexagon" clipPathUnits="objectBoundingBox">
          <path d="M 0.25,0.05 L 0.75,0.05 L 0.98,0.5 L 0.75,0.95 L 0.25,0.95 L 0.02,0.5 Z" />
        </clipPath>

        {/* 4. Five-Point Star */}
        <clipPath id="svg-mask-star" clipPathUnits="objectBoundingBox">
          <path d="M 0.5,0.02 L 0.62,0.35 L 0.98,0.35 L 0.69,0.56 L 0.8,0.92 L 0.5,0.7 L 0.2,0.92 L 0.31,0.56 L 0.02,0.35 L 0.38,0.35 Z" />
        </clipPath>

        {/* 5. Oval */}
        <clipPath id="svg-mask-oval" clipPathUnits="objectBoundingBox">
          <ellipse cx="0.5" cy="0.5" rx="0.48" ry="0.38" />
        </clipPath>
      </defs>
    </svg>
  );
}
