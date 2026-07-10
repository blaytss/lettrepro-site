import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { soraFont } from "./fonts";
import { theme } from "./theme";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [20, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          transform: `scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 220, height: 220 }} />
        <div
          style={{
            fontFamily: soraFont,
            fontWeight: 800,
            fontSize: 76,
            color: theme.cream,
          }}
        >
          Lettre<span style={{ color: theme.orange }}>Pro</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 420,
          fontFamily: soraFont,
          fontWeight: 600,
          fontSize: 40,
          color: theme.muted,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        Ta lettre de motivation, générée par l'IA
      </div>
    </AbsoluteFill>
  );
};
