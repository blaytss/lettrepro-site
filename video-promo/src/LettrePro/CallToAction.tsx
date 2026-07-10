import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { soraFont, interFont } from "./fonts";
import { theme } from "./theme";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 11, mass: 0.5 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 1 + Math.sin(frame / 8) * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: soraFont,
            fontWeight: 800,
            fontSize: 64,
            color: theme.cream,
            lineHeight: 1.2,
          }}
        >
          Essaie-la gratuitement
        </div>
        <div
          style={{
            transform: `scale(${pulse})`,
            backgroundColor: theme.orange,
            borderRadius: 20,
            padding: "28px 56px",
            fontFamily: soraFont,
            fontWeight: 800,
            fontSize: 52,
            color: theme.bg,
          }}
        >
          lettrepro.app
        </div>
        <div
          style={{
            fontFamily: interFont,
            fontWeight: 500,
            fontSize: 32,
            color: theme.muted,
          }}
        >
          Aucune carte bancaire requise
        </div>
      </div>
    </AbsoluteFill>
  );
};
