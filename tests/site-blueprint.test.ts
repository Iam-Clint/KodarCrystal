import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createBlueprint, contextualPrompt, estimateCredits, normalizeEffort } from '../src/lib/site-blueprint.ts';
describe('pre-build planning rules', () => {
  test('coffee subscription includes the full requested route inventory', () => {
    assert.deepEqual(createBlueprint('build a landing page for a coffee subscription service').pages.map(p => p.path), ['/', '/pricing', '/about', '/blog', '/blog/[slug]', '/login', '/signup', '/dashboard', '/404']);
  });
  test('selected audience and goal override inferred context', () => {
    const plan = createBlueprint('a coffee shop site', { appType: 'Landing page', audience: 'Students', goal: 'Sell products' });
    assert.equal(plan.audience, 'Students'); assert.equal(plan.goal, 'Sell products');
  });
  test('intake context is prepended without discarding the idea', () => {
    assert.equal(contextualPrompt('a coffee shop site', { appType: 'Landing page', audience: 'Consumers', goal: 'Get signups' }), 'App type: Landing page.\nAudience: Consumers.\nGoal: Get signups.\na coffee shop site');
  });
  test('effort follows low medium high max relative costs', () => {
    const plan = createBlueprint('coffee subscription');
    assert.deepEqual(['low', 'medium', 'high', 'max'].map(e => estimateCredits(plan.pages, plan.componentCount, normalizeEffort(e)).total), [70, 140, 280, 560]);
  });
  test('explicit names and distinct app types affect the blueprint', () => {
    assert.equal(createBlueprint('a portfolio called Nova').name, 'Nova');
    assert.equal(createBlueprint('a shop', { appType: 'E-commerce' }).pages.some(p => p.path === '/checkout'), true);
  });
  test('explicit names do not swallow the following instruction', () => {
    assert.equal(createBlueprint('a portfolio called Nova with a contact form').name, 'Nova');
    assert.equal(createBlueprint('a shop named Atlas Commerce with checkout').name, 'Atlas Commerce');
  });
});
