import { chromium } from 'playwright'
const b = await chromium.launch()
const errs = []
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } })
p.on('pageerror', (e) => errs.push(String(e)))
p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()) })
await p.goto('http://localhost:4321/demo-cestneprvky/', { waitUntil: 'networkidle' })
// pocitadla: pred a po vstupe do viewportu
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(400)
console.log('pred scrollom:', await p.evaluate(() => [...document.querySelectorAll('#kto-sme .tabular-nums')].map((n) => n.textContent).join(' ')))
await p.evaluate(() => document.getElementById('kto-sme').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(300)
console.log('hned po vstupe:', await p.evaluate(() => [...document.querySelectorAll('#kto-sme .tabular-nums')].map((n) => n.textContent).join(' ')))
await p.waitForTimeout(1600)
console.log('po dopocitani:', await p.evaluate(() => [...document.querySelectorAll('#kto-sme .tabular-nums')].map((n) => n.textContent).join(' ')))
// oddelovac
const o = await p.evaluate(() => {
  const d = document.querySelector('[data-oddelovac]')
  const r = d.getBoundingClientRect()
  return { sirka: Math.round(r.width), left: Math.round(r.left), prepinace: d.querySelectorAll('button:not([hidden])').length, viditelnePrepinace: [...d.querySelectorAll('span[hidden]')].length }
})
console.log('oddelovac:', JSON.stringify(o), '· scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth))
await p.evaluate(() => document.getElementById('kto-sme').scrollIntoView({ block: 'start' }))
await p.evaluate(() => window.scrollBy(0, -80))
await p.waitForTimeout(1600)
await p.screenshot({ path: process.argv[2] + '/ktosme.png' })
console.log('CHYBY', errs.length, errs.slice(0, 3))
await b.close()
