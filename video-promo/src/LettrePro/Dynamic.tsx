import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GlowBackground } from "./GlowBackground";
import { LogoGlowIntro } from "./LogoGlowIntro";
import { MultiStepLaptopScene, LaptopStep, totalStepsDuration } from "./MultiStepLaptopScene";
import { CtaGlowOutro } from "./CtaGlowOutro";

const LOGO_FRAMES = 55;
const CTA_FRAMES = 70;

const LETTER_STEPS: LaptopStep[] = [
  {
    src: "screenshots/generator-blank.png",
    caption: "Décris ton poste...",
    duration: 36,
    typing: [
      { text: "Stage développeur web", left: 4, top: 31.5, width: 44, height: 5.5, startFrame: 4, charsPerFrame: 2.2 },
    ],
  },
  {
    src: "screenshots/generator-poste.png",
    caption: "...et ton profil ✍️",
    duration: 55,
    typing: [
      {
        text: "Capgemini",
        left: 51,
        top: 31.5,
        width: 44,
        height: 5.5,
        startFrame: 4,
        charsPerFrame: 3,
      },
      {
        text: "Étudiant en BUT Informatique 2e année, passionné de développement web, React et Python...",
        left: 4,
        top: 41,
        width: 91,
        height: 9,
        startFrame: 12,
        charsPerFrame: 4,
      },
    ],
  },
  {
    src: "screenshots/generator-loading.png",
    caption: "L'IA rédige ta lettre...",
    duration: 26,
  },
  {
    src: "screenshots/generator-result.png",
    caption: "Ta lettre, prête ✅",
    duration: 30,
    cursor: { from: { x: 30, y: 30 }, to: { x: 7, y: 12 } },
  },
];

const STUDY_STEPS: LaptopStep[] = [
  {
    src: "screenshots/study-blank.png",
    caption: "Colle ton cours...",
    duration: 70,
    typing: [
      {
        text: "Chapitre 3 — Fonctions et dérivées (Python + Maths)\n\ndef derivee(f, x, h=1e-6):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\nUne fonction f est dérivable en x si sa dérivée f'(x) existe.\nRègle : la dérivée de x^n est n * x^(n-1).\nExemple : f(x) = x^2 → f'(x) = 2x",
        left: 4,
        top: 33,
        width: 91,
        height: 18,
        startFrame: 4,
        charsPerFrame: 6,
        fontSize: 15,
      },
    ],
  },
  {
    src: "screenshots/study-typed.png",
    caption: "...même du code 💻",
    duration: 30,
    cursor: { from: { x: 55, y: 60 }, to: { x: 18, y: 93 } },
  },
  {
    src: "screenshots/study-loading.png",
    caption: "Le quiz se génère...",
    duration: 26,
  },
];

const QUIZ_STEPS: LaptopStep[] = [
  {
    src: "screenshots/quiz-q1-question.png",
    caption: "Question 1...",
    duration: 30,
    cursor: { from: { x: 45, y: 25 }, to: { x: 72, y: 55 } },
  },
  {
    src: "screenshots/quiz-q1-correct.png",
    caption: "Bonne réponse ✅",
    duration: 28,
    cursor: { from: { x: 30, y: 30 }, to: { x: 75, y: 90 } },
    sfx: { src: "audio/ding-correct.mp3", volume: 1.8 },
  },
  {
    src: "screenshots/quiz-q2-question.png",
    caption: "Question 2...",
    duration: 30,
    cursor: { from: { x: 45, y: 25 }, to: { x: 28, y: 55 } },
  },
  {
    src: "screenshots/quiz-q2-correct.png",
    caption: "Encore bon ✅",
    duration: 28,
    cursor: { from: { x: 72, y: 30 }, to: { x: 75, y: 90 } },
    sfx: { src: "audio/ding-correct.mp3", volume: 1.8 },
  },
  {
    src: "screenshots/quiz-final-reward.png",
    caption: "🎁 Crédits gagnés !",
    duration: 50,
    sfx: { src: "audio/reward-chime.mp3", volume: 2.2 },
  },
];

const LETTER_FROM = LOGO_FRAMES - 5;
const STUDY_FROM = LETTER_FROM + totalStepsDuration(LETTER_STEPS, 0);
const QUIZ_FROM = STUDY_FROM + totalStepsDuration(STUDY_STEPS, 0);
const CTA_FROM = QUIZ_FROM + totalStepsDuration(QUIZ_STEPS, 0);
const TOTAL_FRAMES = CTA_FROM + CTA_FRAMES;

export const dynamicDuration = TOTAL_FRAMES;

export const Dynamic: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("audio/bg-music.mp3")} volume={1.1} />
      <GlowBackground />

      <Sequence from={0} durationInFrames={LOGO_FRAMES}>
        <LogoGlowIntro tagline="Candidatures & révisions, boostées par l'IA" />
      </Sequence>

      <Sequence from={LETTER_FROM} durationInFrames={totalStepsDuration(LETTER_STEPS, 0)}>
        <MultiStepLaptopScene stepFrames={30} steps={LETTER_STEPS} />
      </Sequence>

      <Sequence from={STUDY_FROM} durationInFrames={totalStepsDuration(STUDY_STEPS, 0)}>
        <MultiStepLaptopScene stepFrames={30} steps={STUDY_STEPS} />
      </Sequence>

      <Sequence from={QUIZ_FROM} durationInFrames={totalStepsDuration(QUIZ_STEPS, 0)}>
        <MultiStepLaptopScene stepFrames={30} steps={QUIZ_STEPS} />
      </Sequence>

      <Sequence from={CTA_FROM} durationInFrames={CTA_FRAMES}>
        <CtaGlowOutro headline="Essaie-la gratuitement" subtext="Lettres, quiz, fiches et profs — sur lettrepro.app" />
      </Sequence>
    </AbsoluteFill>
  );
};
