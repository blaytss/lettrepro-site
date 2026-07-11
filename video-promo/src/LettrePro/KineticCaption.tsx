import { interpolate, useCurrentFrame } from "remotion";
import { soraFont } from "./fonts";
import { theme } from "./theme";

export const KineticCaption: React.FC<{
  text: string;
  from: number;
  to: number;
  color?: string;
}> = ({ text, from, to, color = theme.cream }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [from, from + 6, to - 5, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [from, from + 8, to], [0.82, 1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [from, from + 8], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < from - 1 || frame > to + 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "0 60px",
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      <span
        style={{
          fontFamily: soraFont,
          fontWeight: 800,
          fontSize: 58,
          color,
          textShadow: `0 0 40px ${theme.orange}99, 0 4px 24px rgba(0,0,0,0.6)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
