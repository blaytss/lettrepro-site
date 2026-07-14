import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LogoReveal } from "./LogoReveal";
import { ShowcaseScene } from "./ShowcaseScene";
import { CallToAction } from "./CallToAction";
import { theme } from "./theme";

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Showcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Sequence from={0} durationInFrames={70}>
        <LogoReveal tagline="Découvre LettrePro en action" />
      </Sequence>

      <Sequence from={60} durationInFrames={150}>
        <FadeIn>
          <ShowcaseScene
            caption="Ta lettre de motivation, générée par l'IA"
            beforeSrc="screenshots/generator-full.png"
            afterSrc="screenshots/generator-result.png"
            cursorFrom={{ x: 60, y: 70 }}
            cursorTo={{ x: 16, y: 88 }}
          />
        </FadeIn>
      </Sequence>

      <Sequence from={200} durationInFrames={150}>
        <FadeIn>
          <ShowcaseScene
            caption="Des quiz générés à partir de ton cours"
            beforeSrc="screenshots/quiz-q1-question.png"
            afterSrc="screenshots/quiz-q1-correct.png"
            cursorFrom={{ x: 30, y: 20 }}
            cursorTo={{ x: 69, y: 54 }}
          />
        </FadeIn>
      </Sequence>

      <Sequence from={340} durationInFrames={80}>
        <FadeIn>
          <CallToAction headline="Essaie-la gratuitement" subtext="Lettres, quiz, fiches et profs — gratuit pour commencer" />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
