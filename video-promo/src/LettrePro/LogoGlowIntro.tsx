import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { soraFont } from "./fonts";
import { theme } from "./theme";

export const LogoGlowIntro: React.FC<{ tagline: string }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 9, mass: 0.55 } });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowScale = 1 + Math.sin(frame / 10) * 0.05;
  const glowOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [16, 26], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orange} 0%, ${theme.orangeDark}88 34%, transparent 68%)`,
          filter: "blur(50px)",
          opacity: glowOpacity * 0.9,
          transform: `scale(${glowScale})`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: 200, height: 200 }} />
        <div style={{ fontFamily: soraFont, fontWeight: 800, fontSize: 72, color: theme.cream }}>
          Lettre<span style={{ color: theme.orange }}>Pro</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 560,
          fontFamily: soraFont,
          fontWeight: 600,
          fontSize: 38,
          color: theme.muted,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
