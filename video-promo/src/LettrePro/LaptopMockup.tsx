import { Img, staticFile } from "remotion";
import { theme } from "./theme";

export const LaptopMockup: React.FC<{ src: string; width?: number }> = ({ src, width = 880 }) => {
  return (
    <div style={{ perspective: 2000 }}>
      <div
        style={{
          width,
          transform: "rotateX(12deg) scaleY(0.98)",
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            borderRadius: "18px 18px 3px 3px",
            overflow: "hidden",
            border: "7px solid #161311",
            borderBottom: "3px solid #161311",
            boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px ${theme.border}`,
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              backgroundColor: theme.bgSurface,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FF6B6B" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FFB400" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#5CDB95" }} />
          </div>
          <Img src={staticFile(src)} style={{ display: "block", width: "100%" }} />
        </div>

        <div
          style={{
            width: width + 60,
            marginLeft: -30,
            height: 26,
            background: "linear-gradient(#2b2622, #0c0a08)",
            borderRadius: "0 0 14px 14px",
            boxShadow: "0 40px 60px rgba(0,0,0,0.55)",
          }}
        />
      </div>
    </div>
  );
};
