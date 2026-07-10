import { PromoTemplate } from "./PromoTemplate";

export const CoursPromo: React.FC = () => {
  return (
    <PromoTemplate
      tagline="Résumés, fiches, quiz & profs — tout en un"
      featuresHeading="Révise plus vite avec LettrePro"
      features={[
        { emoji: "📚", text: "Colle ton cours, l'IA fait le reste" },
        { emoji: "🎯", text: "Quiz automatiques par niveau" },
        { emoji: "👩‍🏫", text: "Visios avec des profs en ligne" },
        { emoji: "🏆", text: "Quête du jour = crédits gratuits" },
      ]}
      ctaHeadline="Révise gratuitement"
      ctaSubtext="Cours, quiz et profs sur lettrepro.app"
    />
  );
};
