import { useCurrentFrame } from "remotion";
import { interFont } from "./fonts";

export type TypingField = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  startFrame?: number;
  charsPerFrame?: number;
  fontSize?: number;
};

const Field: React.FC<TypingField> = ({
  text,
  left,
  top,
  width,
  height,
  startFrame = 0,
  charsPerFrame = 2.2,
  fontSize = 17,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const elapsed = frame - startFrame;
  const count = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const done = count >= text.length;
  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        boxSizing: "border-box",
        backgroundColor: "#FFF4EE",
        border: "1px solid #FDDCC8",
        borderRadius: 8,
        padding: "12px 15px",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: interFont,
          fontSize,
          color: "#1C1107",
          lineHeight: 1.35,
          whiteSpace: "pre-wrap",
        }}
      >
        {text.slice(0, count)}
        {!done && <span style={{ opacity: blink ? 1 : 0 }}>▌</span>}
      </span>
    </div>
  );
};

export const TypingOverlay: React.FC<{ fields: TypingField[] }> = ({ fields }) => {
  return (
    <>
      {fields.map((field, i) => (
        <Field key={i} {...field} />
      ))}
    </>
  );
};
