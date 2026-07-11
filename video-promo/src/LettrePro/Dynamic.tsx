import { AbsoluteFill, Sequence } from "remotion";
import { GlowBackground } from "./GlowBackground";
import { LogoGlowIntro } from "./LogoGlowIntro";
import { LaptopScene } from "./LaptopScene";
import { CtaGlowOutro } from "./CtaGlowOutro";

export const Dynamic: React.FC = () => {
  return (
    <AbsoluteFill>
      <GlowBackground />

      <Sequence from={0} durationInFrames={55}>
        <LogoGlowIntro tagline="Candidatures & révisions, boostées par l'IA" />
      </Sequence>

      <Sequence from={50} durationInFrames={90}>
        <LaptopScene
          beforeSrc="screenshots/generator-empty.png"
          afterSrc="screenshots/generator-filled.png"
          beforeCaption="Décris ton profil"
          afterCaption="Ta lettre, prête ✅"
          cutAt={38}
          duration={90}
        />
      </Sequence>

      <Sequence from={140} durationInFrames={90}>
        <LaptopScene
          beforeSrc="screenshots/quiz-question.png"
          afterSrc="screenshots/quiz-correct.png"
          beforeCaption="Un quiz sur ton cours 📚"
          afterCaption="Bonne réponse ✅"
          cutAt={38}
          duration={90}
        />
      </Sequence>

      <Sequence from={230} durationInFrames={70}>
        <CtaGlowOutro headline="Essaie-la gratuitement" subtext="Lettres, quiz, fiches et profs — sur lettrepro.app" />
      </Sequence>
    </AbsoluteFill>
  );
};
