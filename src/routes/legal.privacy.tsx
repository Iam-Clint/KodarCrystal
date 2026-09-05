import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Crystal.dev" },
      { name: "description", content: "How Crystal.dev collects, uses and protects your data." },
      { property: "og:title", content: "Privacy Policy — Crystal.dev" },
      { property: "og:description", content: "How Crystal.dev collects, uses and protects your data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 1, 2026"
      intro="This Privacy Policy explains what Crystal.dev collects, why, and the choices you have. This is placeholder copy for a demo product and is not legal advice."
      sections={[
        {
          heading: "1. What we collect",
          body: [
            "Account data: your name, email and OAuth identity (Google, Apple or GitHub) when you sign up.",
            "Usage data: prompts, generation events, credit consumption and the connectors you enable, so we can operate the service and enforce plan limits.",
          ],
        },
        {
          heading: "2. How we use it",
          body: [
            "To provide and improve the builder, personalize suggestions, meter billing, and keep the service secure.",
            "We do not sell your personal data, and we do not use your private project code to train models without an explicit opt-in.",
          ],
        },
        {
          heading: "3. Third-party processors",
          body: [
            "We rely on infrastructure, model and payment providers to run Crystal.dev. Data is shared with them only as needed to deliver the service, under their own privacy terms.",
          ],
        },
        {
          heading: "4. Retention and deletion",
          body: [
            "Project data is kept while your account is active. You can delete projects at any time, and deleting your account removes personal data within 30 days, except where retention is required by law.",
          ],
        },
        {
          heading: "5. Your rights",
          body: [
            "Depending on where you live (including under the Nigeria Data Protection Act), you may request access, correction, export or deletion of your personal data by emailing privacy@crystal.dev.",
          ],
        },
        {
          heading: "6. Contact",
          body: ["Questions about privacy: privacy@crystal.dev."],
        },
      ]}
    />
  );
}
