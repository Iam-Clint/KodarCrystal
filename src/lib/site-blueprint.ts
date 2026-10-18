export const appTypes = ['Landing page', 'SaaS dashboard', 'Portfolio', 'E-commerce', 'Blog', 'Mobile app'] as const;
export const audiences = ['Consumers', 'Developers', 'Business teams', 'Students'] as const;
export const goals = ['Get signups', 'Showcase work', 'Sell products', 'Inform & educate'] as const;
export const effortLevels = [
  { id: 'low', label: 'Low', desc: 'Fast, minimal reasoning — small tweaks', cost: '~1x', multiplier: 1 },
  { id: 'medium', label: 'Medium', desc: 'Balanced — most tasks', cost: '~2x', multiplier: 2 },
  { id: 'high', label: 'High', desc: 'Deeper reasoning — complex features', cost: '~4x', multiplier: 4 },
  { id: 'max', label: 'Max', desc: 'Maximum reasoning — hardest problems', cost: '~8x', multiplier: 8 },
] as const;
export type Effort = typeof effortLevels[number]['id'];
export type IntakeContext = { appType?: string; audience?: string; goal?: string; name?: string; style?: string; visibility?: string };
export type PlannedPage = { path: string; name: string; sections: string[]; complexity: 'Simple' | 'Medium' | 'Complex' };
const page = (path: string, name: string, sections: string[], complexity: PlannedPage['complexity'] = 'Medium'): PlannedPage => ({ path, name, sections, complexity });
export const brewlyPages = [page('/', 'Home', ['Hero', 'Features', 'Testimonials', 'Pricing', 'Footer']), page('/pricing', 'Pricing', ['Plan comparison', 'Subscription plans', 'FAQ']), page('/about', 'About', ['Brand story', 'Founder', 'Values']), page('/blog', 'Blog', ['Article list', 'Category filter'])];
export const lumenPages = [page('/', 'Home', ['Overview']), page('/dashboard', 'Dashboard', ['Balance', 'Recent activity'], 'Complex'), page('/wallet', 'Wallet', ['Accounts', 'Transactions'], 'Complex'), page('/goals', 'Goals', ['Savings targets']), page('/insights', 'Insights', ['Charts', 'AI insights'], 'Complex')];
export function inferProjectName(prompt: string) {
  const named = prompt.match(/(?:called|named)\s+["']?([\w-]+(?:\s+[A-Z][\w-]+)?)/i)?.[1];
  if (named) return named.replace(/["'.,]+$/, '');
  if (/coffee|beans|roast/i.test(prompt)) return 'Brewly Coffee';
  if (/finance|budget|wallet/i.test(prompt)) return 'Lumen Finance';
  const words = prompt.replace(/[^\w\s-]/g, '').split(/\s+/).filter(w => w && !/^(build|create|make|design|me|a|an|the|for|with|app|site|website|page|landing)$/i.test(w)).slice(0, 3);
  return words.length ? words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Untitled Project';
}
export function normalizeEffort(value: string): Effort { return effortLevels.find(e => e.id === value)?.id ?? 'medium'; }
export function contextualPrompt(prompt: string, context: IntakeContext) {
  const entries = [['App type', context.appType], ['Audience', context.audience], ['Goal', context.goal], ['Project name', context.name], ['Design direction', context.style], ['Visibility', context.visibility]].filter(([, value]) => value);
  return [...entries.map(([label, value]) => `${label}: ${value}.`), prompt.trim()].join('\n');
}
export function estimateCredits(pages: PlannedPage[], componentCount: number, effort: Effort) {
  const multiplier = effortLevels.find(e => e.id === effort)?.multiplier ?? 2;
  const creditsPerPage = 6 * multiplier;
  const componentCredits = componentCount * multiplier;
  return { pageCount: pages.length, creditsPerPage, componentCount, componentCredits, total: pages.length * creditsPerPage + componentCredits };
}
export function createBlueprint(prompt: string, context: IntakeContext = {}) {
  const text = prompt.toLowerCase();
  const appType = context.appType || (/dashboard|saas/.test(text) ? 'SaaS dashboard' : /portfolio/.test(text) ? 'Portfolio' : /e-commerce|store|shop|sell products/.test(text) && !/coffee|landing/.test(text) ? 'E-commerce' : /blog/.test(text) && !/landing/.test(text) ? 'Blog' : /mobile app/.test(text) ? 'Mobile app' : 'Landing page');
  let pages: PlannedPage[];
  let features: string[];
  if (appType === 'SaaS dashboard' || appType === 'Mobile app') {
    pages = [page('/', 'Landing', ['Hero', 'Features', 'Pricing']), page('/dashboard', 'Dashboard', ['Summary cards', 'Activity', 'Quick actions'], 'Complex'), page('/projects', 'Projects', ['Project list', 'Search', 'Filters']), page('/projects/[id]', 'Project details', ['Details', 'Activity', 'Editor'], 'Complex'), page('/settings', 'Settings', ['Profile', 'Preferences', 'Billing']), page('/pricing', 'Pricing', ['Plan comparison', 'FAQ'])];
    features = ['MetricCard', 'ActivityFeed', 'ProjectList', 'ProjectEditor', 'PricingCard'];
  } else if (appType === 'Portfolio') {
    pages = [page('/', 'Home', ['Introduction', 'Selected work', 'Contact CTA']), page('/work', 'Work', ['Project grid', 'Category filter']), page('/work/[slug]', 'Case study', ['Project brief', 'Process', 'Gallery']), page('/about', 'About', ['Biography', 'Skills', 'Experience']), page('/contact', 'Contact', ['Contact form', 'Social links'], 'Simple')];
    features = ['ProjectGallery', 'CaseStudy', 'SkillsList', 'ContactForm'];
  } else if (appType === 'E-commerce') {
    pages = [page('/', 'Home', ['Hero', 'Featured products', 'Testimonials']), page('/products', 'Products', ['Product grid', 'Filters', 'Sort']), page('/products/[slug]', 'Product', ['Gallery', 'Variants', 'Reviews'], 'Complex'), page('/cart', 'Cart', ['Line items', 'Totals']), page('/checkout', 'Checkout', ['Shipping', 'Payment', 'Confirmation'], 'Complex'), page('/about', 'About', ['Brand story', 'Values'])];
    features = ['ProductCard', 'ProductGallery', 'CartSummary', 'CheckoutForm', 'ReviewList'];
  } else if (appType === 'Blog') {
    pages = [page('/', 'Home', ['Featured stories', 'Latest posts', 'Newsletter']), page('/blog', 'Blog', ['Article list', 'Category filter']), page('/blog/[slug]', 'Single post', ['Article', 'Author', 'Related posts']), page('/about', 'About', ['Editorial mission', 'Authors']), page('/contact', 'Contact', ['Contact form'], 'Simple')];
    features = ['ArticleCard', 'ArticleFilter', 'PostContent', 'NewsletterForm'];
  } else {
    pages = [page('/', 'Landing page', ['Hero', 'Features', 'Testimonials', 'Pricing', 'Footer']), ...brewlyPages.slice(1), page('/blog/[slug]', 'Single post', ['Article', 'Author', 'Related posts'])];
    features = ['PricingCard', 'TestimonialCarousel', 'FeatureGrid', 'ArticleCard', 'ArticleFilter', 'NewsletterForm'];
  }
  if (appType !== 'Portfolio') pages.push(page('/login', 'Login', ['Email login', 'Social sign-in', 'Reset password'], 'Simple'), page('/signup', 'Signup', ['Account form', 'Social sign-in', 'Terms'], 'Simple'));
  if (!pages.some(p => p.path === '/dashboard') && appType !== 'Portfolio') pages.push(page('/dashboard', 'User account', ['Profile', appType === 'Blog' ? 'Saved posts' : 'Order history', 'Subscription settings'], 'Complex'));
  pages.push(page('/404', 'Not found', ['Error illustration', 'Home link'], 'Simple'));
  const components = { Layout: ['Navbar', 'Footer', ...(pages.some(p => p.path === '/dashboard') ? ['Sidebar'] : [])], UI: ['Card', 'Button', 'Badge', 'Input', 'Dialog'], Feature: features, Auth: appType === 'Portfolio' ? [] : ['LoginForm', 'SignupForm'] };
  const audience = context.audience || (appType === 'SaaS dashboard' ? 'Business teams' : 'Consumers');
  const goal = context.goal || (appType === 'Portfolio' ? 'Showcase work' : appType === 'E-commerce' ? 'Sell products' : appType === 'Blog' ? 'Inform & educate' : 'Get signups');
  return { name: context.name?.trim() || inferProjectName(prompt), description: `${prompt.trim().replace(/[.!?]+$/, '') || 'A thoughtfully designed app'}.`, audience, goal, appType, pages, components, componentCount: Object.values(components).flat().length, tech: ['React + TypeScript', 'TailwindCSS', 'shadcn/ui', 'TanStack Router', 'Framer Motion'], contextPrompt: contextualPrompt(prompt, context) };
}
export type SiteBlueprint = ReturnType<typeof createBlueprint>;