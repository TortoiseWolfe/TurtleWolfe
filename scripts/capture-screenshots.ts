import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const PORTFOLIO_DIR = path.join(process.cwd(), 'public', 'portfolio');

interface SiteConfig {
  url: string;
  dir: string;
  filename: string;
  viewport?: { width: number; height: number };
}

const SITES: SiteConfig[] = [
  {
    url: 'https://SpokeToWork.com',
    dir: 'spoketo-work',
    filename: 'hero.png',
    viewport: { width: 1600, height: 900 },
  },
  {
    url: 'https://ScriptHammer.com',
    dir: 'scripthammer',
    filename: 'hero.png',
  },
  {
    url: 'https://tortoisewolfe.github.io/Resume/',
    dir: 'other',
    filename: 'interactive-resume.png',
  },
  {
    url: 'https://tortoisewolfe.github.io/The_House_that_Code_Built/',
    dir: 'other',
    filename: 'house-that-code-built.png',
  },
  {
    url: 'https://github.com/TortoiseWolfe/Trinam_23',
    dir: 'revit-plugins',
    filename: 'hero.png',
  },
  {
    url: 'https://github.com/TurtleWolfe/DevCamperAPIv001',
    dir: 'other',
    filename: 'devcamper-api.png',
  },
  {
    url: 'https://github.com/TurtleWolfe/fccTempLate',
    dir: 'other',
    filename: 'freecodecamp.png',
  },
  {
    url: 'https://github.com/TortoiseWolfe/GrimGlow_planning',
    dir: 'other',
    filename: 'grimglow.png',
  },
];

async function main() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  for (const site of SITES) {
    const dir = path.join(PORTFOLIO_DIR, site.dir);
    fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, site.filename);

    console.log(`Capturing ${site.url} → ${site.dir}/${site.filename}`);
    const ctx = site.viewport
      ? await browser.newContext({ viewport: site.viewport })
      : context;
    const page = await ctx.newPage();
    try {
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000); // let animations settle
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`  ✓ saved ${outPath}`);
    } catch (err) {
      console.error(`  ✗ failed: ${err}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done!');
}

main();
