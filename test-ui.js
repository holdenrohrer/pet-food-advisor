import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || 'chromium'
  });
  const page = await browser.newPage();

  console.log('Opening page...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Screenshot initial state
  await page.screenshot({ path: 'screenshot-1-initial.png', fullPage: true });
  console.log('Saved: screenshot-1-initial.png');

  // Click Prototype 3 (Interactive)
  console.log('Clicking Prototype 3...');
  await page.click('button:has-text("Prototype 3")');

  // Wait for first response (longer timeout)
  console.log('Waiting for AI response...');
  await page.waitForTimeout(20000);

  await page.screenshot({ path: 'screenshot-2-after-p3.png', fullPage: true });
  console.log('Saved: screenshot-2-after-p3.png');

  // Check what's visible in the chat
  const messages = await page.locator('.message').allTextContents();
  console.log('\n=== MESSAGES IN UI ===');
  messages.forEach((m, i) => {
    console.log(`[${i}] ${m.substring(0, 200)}${m.length > 200 ? '...' : ''}`);
  });

  // Check inspector content
  const inspector = await page.locator('#inspector').textContent();
  console.log('\n=== INSPECTOR CONTENT (first 500 chars) ===');
  console.log(inspector.substring(0, 500));

  // Check if there are option buttons to click
  const optionBtns = await page.locator('.option-btn').all();
  console.log(`\n=== FOUND ${optionBtns.length} OPTION BUTTONS ===`);

  if (optionBtns.length > 0) {
    const firstOption = await optionBtns[0].textContent();
    console.log(`Clicking first option: "${firstOption}"`);
    await optionBtns[0].click();

    console.log('Waiting for next response...');
    await page.waitForTimeout(15000);

    await page.screenshot({ path: 'screenshot-3-after-option.png', fullPage: true });
    console.log('Saved: screenshot-3-after-option.png');

    const messagesAfter = await page.locator('.message').allTextContents();
    console.log('\n=== MESSAGES AFTER CLICKING OPTION ===');
    messagesAfter.forEach((m, i) => {
      console.log(`[${i}] ${m.substring(0, 300)}${m.length > 300 ? '...' : ''}`);
    });
  }

  await browser.close();
  console.log('\nDone!');
}

test().catch(console.error);
