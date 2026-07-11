import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { LaptopMockup } from "./LaptopMockup";
import { KineticCaption } from "./KineticCaption";
import { Cursor } from "./Cursor";

export type LaptopStep = {
  src: string;
  caption: string;
  cursor?: { from: { x: number; y: number }; to: { x: number; y: number } };
};

const StepFrame: React.FC<{ step: LaptopStep; isFirst: boolean; stepFrames: number }> = ({
  step,
  isFirst,
  stepFrames,
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
      <KineticCaption text={step.caption} from={2} to={stepFrames - 6} />

      <div
        style={{
          position: "relative",
          transform: `scale(${punch})`,
          opacity: entryOpacity,
          marginTop: 60,
        }}
      >
        <LaptopMockup src={step.src} />
        {step.cursor && (
          <Cursor
            fromX={step.cursor.from.x}
            fromY={step.cursor.from.y}
            toX={step.cursor.to.x}
            toY={step.cursor.to.y}
            travelStart={8}
            clickAt={stepFrames - 16}
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
  return (
    <>
      {steps.map((step, i) => (
        <Sequence key={i} from={i * stepFrames} durationInFrames={stepFrames}>
          <StepFrame step={step} isFirst={i === 0} stepFrames={stepFrames} />
        </Sequence>
      ))}
    </>
  );
};
