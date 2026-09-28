// Renders the three transparent seat-row PNGs used by Seat Lab version E.
// Usage: PW=$(npm root -g)/playwright node scripts/seat-rows/render.js $PWD/scripts/seat-rows
// Output lands in scripts/seat-rows/rows/; copy it to site/lab/seats/rows/.
const { chromium } = require(process.env.PW);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 5000, height: 800 } });
  await p.goto('file://' + process.argv[2] + '/render.html');
  const specs = [
    ['back', 18, 1, 9, 'brightness(0.95) blur(1.2px)'],
    ['mid', 13, 2, -1, 'brightness(0.7) blur(0.4px)'],
    ['front', 9, 3, 4, 'brightness(0.5)'],
  ];
  for (const [name, n, i, rab, filt] of specs) {
    await p.evaluate(([n, i, rab]) => window.make(n, i, rab, 180), [n, i, rab]);
    await p.evaluate(f => document.getElementById('r').style.filter = f, filt);
    await p.locator('#r').screenshot({ path: `${process.argv[2]}/rows/seats-${name}.png`, omitBackground: true });
  }
  await b.close();
})();
