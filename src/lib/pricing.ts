/** Shared demo prices in USD. Production prices must come from the billing API. */
export const demoPlans = [
  { name: "Free", monthly: 0, yearly: 0, price: 0, tagline: "For exploring", featured: false, features: ["3 projects / month", "Community templates", "Basic export", "Single workspace"] },
  { name: "Pro", monthly: 24, yearly: 19, price: 24, tagline: "For builders", featured: true, features: ["Unlimited projects", "Premium templates", "All export formats", "Custom domain", "Priority AI", "Version history"] },
  { name: "Team", monthly: 99, yearly: 79, price: 99, tagline: "For teams", featured: false, features: ["Everything in Pro", "Multiplayer editing", "Roles & SSO", "Shared design system", "Audit logs", "Dedicated support"] },
];
