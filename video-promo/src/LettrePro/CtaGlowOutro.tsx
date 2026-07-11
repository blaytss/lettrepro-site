import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { soraFont, interFont } from "./fonts";
import { theme } from "./theme";

export const CtaGlowOutro: React.FC<{ headline: string; subtext: string }> = ({ headline, subtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 8) * 0.035;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Audio src={staticFile("audio/logo-swell.mp3")} volume={1.2} />
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orange} 0%, ${theme.orangeDark}77 36%, transparent 70%)`,
          filter: "blur(55px)",
          opacity: glowOpacity * 0.85,
        }}
      />
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 46,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: soraFont, fontWeight: 800, fontSize: 66, color: theme.cream, lineHeight: 1.2 }}>
          {headline}
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
            boxShadow: `0 0 60px ${theme.orange}aa`,
          }}
        >
          lettrepro.app
        </div>
        <div style={{ fontFamily: interFont, fontWeight: 500, fontSize: 32, color: theme.muted }}>{subtext}</div>
      </div>
    </AbsoluteFill>
  );
};
