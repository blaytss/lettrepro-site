import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { soraFont } from "./fonts";
import { theme } from "./theme";
import { Cursor } from "./Cursor";

export type ShowcaseSceneProps = {
  caption: string;
  beforeSrc: string;
  afterSrc: string;
  cursorFrom: { x: number; y: number };
  cursorTo: { x: number; y: number };
};

const BrowserFrame: React.FC<{ children: React.ReactNode; zoom: number }> = ({ children, zoom }) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        border: `1px solid ${theme.border}`,
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "14px 18px",
          backgroundColor: theme.bgSurface,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF6B6B" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFB400" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#5CDB95" }} />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>{children}</div>
      </div>
    </div>
  );
};

export const ShowcaseScene: React.FC<ShowcaseSceneProps> = ({
  caption,
  beforeSrc,
  afterSrc,
  cursorFrom,
  cursorTo,
}) => {
  const frame = useCurrentFrame();

  const captionOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(frame, [0, 15], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const frameScale = interpolate(frame, [10, 150], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [10, 150], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clickAt = 46;
  const crossfadeStart = clickAt + 10;
  const crossfadeEnd = crossfadeStart + 16;
  const afterOpacity = interpolate(frame, [crossfadeStart, crossfadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowOpacity = interpolate(frame, [0, 20], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.orange} 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
          width: "100%",
          padding: "0 64px",
        }}
      >
        <div
          style={{
            fontFamily: soraFont,
            fontWeight: 700,
            fontSize: 46,
            color: theme.cream,
            textAlign: "center",
            opacity: captionOpacity,
            transform: `translateY(${captionY}px)`,
          }}
        >
          {caption}
        </div>

        <div style={{ position: "relative", width: "100%", transform: `scale(${frameScale})` }}>
          <BrowserFrame zoom={zoom}>
            <Img src={staticFile(beforeSrc)} style={{ display: "block", width: "100%" }} />
          </BrowserFrame>
          <div style={{ position: "absolute", inset: 0, opacity: afterOpacity }}>
            <BrowserFrame zoom={zoom}>
              <Img src={staticFile(afterSrc)} style={{ display: "block", width: "100%" }} />
            </BrowserFrame>
          </div>
          <Cursor
            fromX={cursorFrom.x}
            fromY={cursorFrom.y}
            toX={cursorTo.x}
            toY={cursorTo.y}
            travelStart={20}
            clickAt={clickAt}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
