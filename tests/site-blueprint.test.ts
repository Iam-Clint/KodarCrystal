import { describe, expect, test } from 'bun:test';
import { createBlueprint, contextualPrompt, estimateCredits, normalizeEffort } from '../src/lib/site-blueprint';
describe('pre-build planning rules', () => {
  test('coffee subscription includes the full requested route inventory', () => {
    const plan = createBlueprint('build a landing page for a coffee subscription service');
    expect(plan.pages.map(p => p.path)).toEqual(['/', '/pricing', '/about', '/blog', '/blog/[slug]', '/login', '/signup', '/dashboard', '/404']);
  });
  test('selected audience and goal override inferred context', () => {
    const plan = createBlueprint('a coffee shop site', { appType: 'Landing page', audience: 'Students', goal: 'Sell products' });
    expect(plan.audience).toBe('Students'); expect(plan.goal).toBe('Sell products');
  });
  test('intake context is prepended without discarding the idea', () => {
    expect(contextualPrompt('a coffee shop site', { appType: 'Landing page', audience: 'Consumers', goal: 'Get signups' })).toBe('App type: Landing page.\nAudience: Consumers.\nGoal: Get signups.\na coffee shop site');
  });
  test('effort follows low medium high max relative costs', () => {
    const plan = createBlueprint('coffee subscription');
    expect(['low', 'medium', 'high', 'max'].map(e => estimateCredits(plan.pages, plan.componentCount, normalizeEffort(e)).total)).toEqual([70, 140, 280, 560]);
  });
  test('explicit names and distinct app types affect the blueprint', () => {
    expect(createBlueprint('a portfolio called Nova').name).toBe('Nova');
    expect(createBlueprint('a shop', { appType: 'E-commerce' }).pages.some(p => p.path === '/checkout')).toBe(true);
  });
});