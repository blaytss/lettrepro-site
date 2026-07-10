import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LogoReveal } from "./LogoReveal";
import { FeatureList } from "./FeatureList";
import { CallToAction } from "./CallToAction";
import { theme } from "./theme";

const FADE = 15;

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Sequence from={0} durationInFrames={70}>
        <LogoReveal />
      </Sequence>
      <Sequence from={60} durationInFrames={110}>
        <FadeIn>
          <FeatureList />
        </FadeIn>
      </Sequence>
      <Sequence from={160} durationInFrames={80}>
        <FadeIn>
          <CallToAction />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
