import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LaptopMockup } from "./LaptopMockup";
import { KineticCaption } from "./KineticCaption";

export type LaptopSceneProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeCaption: string;
  afterCaption: string;
  cutAt: number;
  duration: number;
};

export const LaptopScene: React.FC<LaptopSceneProps> = ({
  beforeSrc,
  afterSrc,
  beforeCaption,
  afterCaption,
  cutAt,
  duration,
}) => {
  const frame = useCurrentFrame();

  const entryScale = interpolate(frame, [0, 12], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const entryOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punch = interpolate(frame, [cutAt - 2, cutAt, cutAt + 8], [1, 1.07, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [cutAt - 1, cutAt + 1, cutAt + 9], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, duration], [0, -14]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <KineticCaption text={beforeCaption} from={4} to={cutAt} />
      <KineticCaption text={afterCaption} from={cutAt} to={duration - 4} />

      <div
        style={{
          transform: `scale(${entryScale * punch}) translateY(${drift}px)`,
          opacity: entryOpacity,
          marginTop: 60,
        }}
      >
        <LaptopMockup src={frame < cutAt ? beforeSrc : afterSrc} />
      </div>

      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
