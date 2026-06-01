import { memo } from "react";

interface KeyframeEntry {
  percentage: number;
  properties: Record<string, number | string>;
  ease?: string;
}

interface KeyframeCacheEntry {
  format: string;
  keyframes: KeyframeEntry[];
  ease?: string;
  easeEach?: string;
}

interface TimelineClipDiamondsProps {
  keyframesData: KeyframeCacheEntry;
  clipWidthPx: number;
  accentColor: string;
  isSelected: boolean;
  onClickKeyframe?: (percentage: number) => void;
}

export const TimelineClipDiamonds = memo(function TimelineClipDiamonds({
  keyframesData,
  clipWidthPx,
  accentColor,
  isSelected,
  onClickKeyframe,
}: TimelineClipDiamondsProps) {
  if (clipWidthPx < 20) return null;

  return (
    <div className="absolute inset-0" style={{ zIndex: 3, pointerEvents: "none" }}>
      {keyframesData.keyframes.map((kf) => {
        const leftPx = (kf.percentage / 100) * clipWidthPx;
        return (
          <button
            key={kf.percentage}
            type="button"
            className="absolute"
            style={{
              left: leftPx - 4,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "auto",
              padding: 2,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClickKeyframe?.(kf.percentage);
            }}
            title={`${kf.percentage}%`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8">
              <rect
                x="4"
                y="0.5"
                width="4.8"
                height="4.8"
                rx="0.7"
                transform="rotate(45 4 0.5)"
                fill={isSelected ? accentColor : "#a3a3a3"}
                opacity={isSelected ? 0.9 : 0.5}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
});
