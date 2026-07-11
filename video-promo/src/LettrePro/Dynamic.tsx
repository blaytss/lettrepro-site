import { AbsoluteFill, Sequence } from "remotion";
import { GlowBackground } from "./GlowBackground";
import { LogoGlowIntro } from "./LogoGlowIntro";
import { MultiStepLaptopScene } from "./MultiStepLaptopScene";
import { CtaGlowOutro } from "./CtaGlowOutro";

const LOGO_FRAMES = 55;
const LETTER_STEP_FRAMES = 30;
const LETTER_STEPS = 4;
const STUDY_STEP_FRAMES = 30;
const STUDY_STEPS = 3;
const QUIZ_STEP_FRAMES = 28;
const QUIZ_STEPS = 4;
const CTA_FRAMES = 70;

const LETTER_FROM = LOGO_FRAMES - 5;
const STUDY_FROM = LETTER_FROM + LETTER_STEP_FRAMES * LETTER_STEPS;
const QUIZ_FROM = STUDY_FROM + STUDY_STEP_FRAMES * STUDY_STEPS;
const CTA_FROM = QUIZ_FROM + QUIZ_STEP_FRAMES * QUIZ_STEPS;
const TOTAL_FRAMES = CTA_FROM + CTA_FRAMES;

export const dynamicDuration = TOTAL_FRAMES;

export const Dynamic: React.FC = () => {
  return (
    <AbsoluteFill>
      <GlowBackground />

      <Sequence from={0} durationInFrames={LOGO_FRAMES}>
        <LogoGlowIntro tagline="Candidatures & révisions, boostées par l'IA" />
      </Sequence>

      <Sequence from={LETTER_FROM} durationInFrames={LETTER_STEP_FRAMES * LETTER_STEPS}>
        <MultiStepLaptopScene
          stepFrames={LETTER_STEP_FRAMES}
          steps={[
            {
              src: "screenshots/generator-poste.png",
              caption: "Décris ton poste...",
              cursor: { from: { x: 55, y: 55 }, to: { x: 75, y: 29 } },
            },
            {
              src: "screenshots/generator-full.png",
              caption: "...et ton profil ✍️",
              cursor: { from: { x: 60, y: 60 }, to: { x: 16, y: 90 } },
            },
            {
              src: "screenshots/generator-loading.png",
              caption: "L'IA rédige ta lettre...",
            },
            {
              src: "screenshots/generator-result.png",
              caption: "Ta lettre, prête ✅",
              cursor: { from: { x: 30, y: 30 }, to: { x: 7, y: 12 } },
            },
          ]}
        />
      </Sequence>

      <Sequence from={STUDY_FROM} durationInFrames={STUDY_STEP_FRAMES * STUDY_STEPS}>
        <MultiStepLaptopScene
          stepFrames={STUDY_STEP_FRAMES}
          steps={[
            {
              src: "screenshots/study-blank.png",
              caption: "Colle ton cours...",
              cursor: { from: { x: 20, y: 20 }, to: { x: 50, y: 40 } },
            },
            {
              src: "screenshots/study-typed.png",
              caption: "...même du code 💻",
              cursor: { from: { x: 55, y: 60 }, to: { x: 18, y: 93 } },
            },
            {
              src: "screenshots/study-loading.png",
              caption: "Le quiz se génère...",
            },
          ]}
        />
      </Sequence>

      <Sequence from={QUIZ_FROM} durationInFrames={QUIZ_STEP_FRAMES * QUIZ_STEPS}>
        <MultiStepLaptopScene
          stepFrames={QUIZ_STEP_FRAMES}
          steps={[
            {
              src: "screenshots/quiz-question.png",
              caption: "À toi de jouer 🎯",
              cursor: { from: { x: 45, y: 25 }, to: { x: 28, y: 55 } },
            },
            {
              src: "screenshots/quiz-select-a.png",
              caption: "f'(x) = x ?",
              cursor: { from: { x: 28, y: 30 }, to: { x: 72, y: 55 } },
            },
            {
              src: "screenshots/quiz-select-b.png",
              caption: "Plutôt 2x !",
              cursor: { from: { x: 72, y: 30 }, to: { x: 82, y: 85 } },
            },
            {
              src: "screenshots/quiz-correct.png",
              caption: "Bonne réponse ✅",
            },
          ]}
        />
      </Sequence>

      <Sequence from={CTA_FROM} durationInFrames={CTA_FRAMES}>
        <CtaGlowOutro headline="Essaie-la gratuitement" subtext="Lettres, quiz, fiches et profs — sur lettrepro.app" />
      </Sequence>
    </AbsoluteFill>
  );
};
