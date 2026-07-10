import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { soraFont, interFont } from "./fonts";
import { theme } from "./theme";

const features = [
  { emoji: "⚡", text: "Générée en 30 secondes" },
  { emoji: "🤖", text: "Boostée par l'IA" },
  { emoji: "🎯", text: "Adaptée à chaque offre" },
  { emoji: "🆓", text: "Gratuite pour commencer" },
];

const FeatureRow: React.FC<{ emoji: string; text: string; delay: number }> = ({
  emoji,
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.5 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [-80, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity,
        transform: `translateX(${x}px)`,
        backgroundColor: theme.bgSurface,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: "28px 40px",
        width: 780,
      }}
    >
      <div style={{ fontSize: 56 }}>{emoji}</div>
      <div
        style={{
          fontFamily: soraFont,
          fontWeight: 700,
          fontSize: 42,
          color: theme.cream,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const FeatureList: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 200,
          fontFamily: interFont,
          fontWeight: 600,
          fontSize: 34,
          color: theme.muted,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        Pourquoi LettrePro ?
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {features.map((feature, i) => (
          <FeatureRow key={feature.text} {...feature} delay={i * 12} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
