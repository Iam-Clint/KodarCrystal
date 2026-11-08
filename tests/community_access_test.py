"""Run with python3 tests/community_access_test.py while the preview is running."""
import asyncio
from playwright.async_api import async_playwright

async def test_signed_out_community_redirect():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        await page.goto("http://localhost:8080/community")
        await page.wait_for_url("http://localhost:8080/signup")
        assert page.url == "http://localhost:8080/signup"
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_signed_out_community_redirect())
