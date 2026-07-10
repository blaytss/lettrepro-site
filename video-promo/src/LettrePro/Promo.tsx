import { PromoTemplate } from "./PromoTemplate";

export const Promo: React.FC = () => {
  return (
    <PromoTemplate
      tagline="Ta lettre de motivation, générée par l'IA"
      featuresHeading="Pourquoi LettrePro ?"
      features={[
        { emoji: "⚡", text: "Générée en 30 secondes" },
        { emoji: "🤖", text: "Boostée par l'IA" },
        { emoji: "🎯", text: "Adaptée à chaque offre" },
        { emoji: "🆓", text: "Gratuite pour commencer" },
      ]}
      ctaHeadline="Essaie-la gratuitement"
      ctaSubtext="Aucune carte bancaire requise"
    />
  );
};
