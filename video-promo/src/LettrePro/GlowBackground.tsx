import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "./theme";

export const GlowBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 40) * 0.08;
  const rotate = frame * 0.15;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `conic-gradient(from ${rotate}deg at 50% 46%, ${theme.orange}55, transparent 25%, transparent 75%, ${theme.orangeDark}44)`,
          filter: "blur(60px)",
          transform: `scale(${pulse})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 46% at 50% 46%, ${theme.orange}CC 0%, ${theme.orangeDark}66 32%, transparent 68%)`,
          filter: "blur(30px)",
          transform: `scale(${pulse})`,
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 320px 160px ${theme.bg}`,
        }}
      />
    </AbsoluteFill>
  );
};
