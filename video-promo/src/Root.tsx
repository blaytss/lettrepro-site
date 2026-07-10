import "./index.css";
import { Composition } from "remotion";
import { Promo } from "./LettrePro/Promo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      // npx remotion render LettreProTikTok
      id="LettreProTikTok"
      component={Promo}
      durationInFrames={240}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
