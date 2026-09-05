import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Crystal.dev" },
      { name: "description", content: "The terms that govern your use of Crystal.dev, the prompt to app builder." },
      { property: "og:title", content: "Terms of Service — Crystal.dev" },
      { property: "og:description", content: "The terms that govern your use of Crystal.dev." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="September 1, 2026"
      intro="These Terms of Service govern your access to and use of Crystal.dev. By creating an account or using the service, you agree to these terms. This is placeholder copy for a demo product and is not legal advice."
      sections={[
        {
          heading: "1. The service",
          body: [
            "Crystal.dev turns natural-language prompts into working app code. The service is provided as-is and may change, pause or withdraw features at any time.",
            "You must be at least 16 years old to create an account.",
          ],
        },
        {
          heading: "2. Your content and generated code",
          body: [
            "You retain ownership of the prompts you write and, to the extent permitted by law, the code generated specifically for you while subscribed.",
            "You are responsible for reviewing generated code before deploying it to production, including its security, licensing and regulatory suitability.",
          ],
        },
        {
          heading: "3. Acceptable use",
          body: [
            "You agree not to use Crystal.dev to build malware, spam tooling, or products that infringe the rights of others; not to probe or disrupt the service; and not to resell access without written permission.",
          ],
        },
        {
          heading: "4. Credits, billing and refunds",
          body: [
            "Paid plans consume credits for generation, builds and hosting. Unused credits expire at the end of each billing cycle unless stated otherwise.",
            "You can cancel at any time; your plan remains active until the end of the current cycle.",
          ],
        },
        {
          heading: "5. Liability",
          body: [
            "To the maximum extent permitted by law, Crystal.dev is not liable for indirect or consequential damages, and our aggregate liability is limited to the fees you paid in the three months preceding the claim.",
          ],
        },
        {
          heading: "6. Contact",
          body: ["Questions about these terms: legal@crystal.dev."],
        },
      ]}
    />
  );
}
