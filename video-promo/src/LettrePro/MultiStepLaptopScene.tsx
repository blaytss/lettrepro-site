import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LaptopMockup } from "./LaptopMockup";
import { KineticCaption } from "./KineticCaption";
import { Cursor } from "./Cursor";
import { TypingOverlay, TypingField } from "./TypingOverlay";

export type LaptopStep = {
  src: string;
  caption: string;
  duration?: number;
  cursor?: { from: { x: number; y: number }; to: { x: number; y: number } };
  typing?: TypingField[];
};

const StepFrame: React.FC<{ step: LaptopStep; isFirst: boolean; duration: number }> = ({
  step,
  isFirst,
  duration,
}) => {
  const frame = useCurrentFrame();

  const punch = interpolate(frame, [0, 8], [isFirst ? 1 : 1.07, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = isFirst
    ? 0
    : interpolate(frame, [0, 10], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entryOpacity = isFirst
    ? interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <KineticCaption text={step.caption} from={2} to={duration - 6} />

      <div
        style={{
          position: "relative",
          transform: `scale(${punch})`,
          opacity: entryOpacity,
          marginTop: 60,
        }}
      >
        <LaptopMockup src={step.src} />
        {step.typing && <TypingOverlay fields={step.typing} />}
        {step.cursor && (
          <Cursor
            fromX={step.cursor.from.x}
            fromY={step.cursor.from.y}
            toX={step.cursor.to.x}
            toY={step.cursor.to.y}
            travelStart={8}
            clickAt={duration - 16}
          />
        )}
      </div>

      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const MultiStepLaptopScene: React.FC<{ steps: LaptopStep[]; stepFrames: number }> = ({
  steps,
  stepFrames,
}) => {
  let cursorFrame = 0;
  return (
    <>
      {steps.map((step, i) => {
        const duration = step.duration ?? stepFrames;
        const from = cursorFrame;
        cursorFrame += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <StepFrame step={step} isFirst={i === 0} duration={duration} />
          </Sequence>
        );
      })}
    </>
  );
};

export const totalStepsDuration = (steps: LaptopStep[], stepFrames: number) =>
  steps.reduce((sum, step) => sum + (step.duration ?? stepFrames), 0);
