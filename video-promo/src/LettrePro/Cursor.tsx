import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

export const Cursor: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  travelStart: number;
  clickAt: number;
}> = ({ fromX, fromY, toX, toY, travelStart, clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [travelStart - 5, travelStart + 5, clickAt + 24, clickAt + 34],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const travel = spring({
    frame: frame - travelStart,
    fps,
    config: { damping: 16, mass: 0.7 },
  });
  const x = interpolate(travel, [0, 1], [fromX, toX]);
  const y = interpolate(travel, [0, 1], [fromY, toY]);

  const pressProgress = interpolate(frame, [clickAt, clickAt + 6, clickAt + 14], [1, 0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rippleProgress = interpolate(frame, [clickAt, clickAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.3, 2.2]);
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.55, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: `3px solid ${theme.orange}`,
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
          opacity: rippleOpacity,
        }}
      />
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          backgroundColor: theme.orange,
          border: "3px solid white",
          boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          transform: `scale(${pressProgress})`,
        }}
      />
    </div>
  );
};
