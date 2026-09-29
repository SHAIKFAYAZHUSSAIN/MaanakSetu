const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testUi() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9444;

  console.log('Launching headless Chrome on port', port);
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.chrome-ui-test'),
  ]);

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data && data.webSocketDebuggerUrl) {
        break;
      }
    } catch {}
  }

  const newTargetRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/`, {
    method: 'PUT',
  });
  const pageTarget = await newTargetRes.json();
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pendingRequests = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((r) => (ws.onopen = r));

  let pageLoadedResolve;
  const pageLoadedPromise = new Promise((r) => (pageLoadedResolve = r));

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
    if (msg.method === 'Page.loadEventFired') {
      pageLoadedResolve();
    }
  };

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
  await pageLoadedPromise;
  await new Promise((r) => setTimeout(r, 1000));

  async function captureScreenshot(name) {
    const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(__dirname, name);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${outPath} (${buffer.length} bytes)`);
  }

  // 1. Initial page screenshot
  await captureScreenshot('ui_01_landing.png');

  // 2. Click on the "Analysis Results" tab directly in the header navigation
  console.log('Navigating to Analysis Results view...');
  await sendCommand('Runtime.evaluate', {
    expression: `
      const navButtons = Array.from(document.querySelectorAll('button'));
      const resBtn = navButtons.find(b => b.textContent.includes('Analysis Results'));
      if (resBtn) {
        resBtn.click();
      } else {
        const analyzeAction = navButtons.find(b => b.textContent.includes('Analyze Requirement') && b.classList.contains('bg-brand'));
        if (analyzeAction) analyzeAction.click();
      }
    `,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await captureScreenshot('ui_02_results_view.png');

  // Verify elements on results view
  const evalResults = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const verifyButtons = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes('Verify on BIS'));
        const officialBadges = Array.from(document.querySelectorAll('span')).filter(s => s.textContent.includes('OFFICIAL SOURCE'));
        const verifStatusTexts = Array.from(document.querySelectorAll('*')).filter(el => el.textContent.includes('live verification required'));
        const whyRecBtn = document.querySelector('#why-recommended-button');
        return {
          verifyButtonsCount: verifyButtons.length,
          verifyButtonsHrefs: verifyButtons.map(a => a.href),
          officialBadgesCount: officialBadges.length,
          verifStatusFound: verifStatusTexts.length > 0,
          hasWhyRecButton: !!whyRecBtn
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Analysis Results Page Audit:', evalResults.result.value);

  // 3. Open Why Recommended drawer
  console.log('Opening Why Recommended Traceability Drawer...');
  await sendCommand('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('#why-recommended-button');
      if (btn) btn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  await captureScreenshot('ui_03_drawer_open.png');

  // Audit drawer content
  const drawerAudit = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href }));
        return {
          hasStep1: text.includes('Tender Requirement') || text.includes('Tender Statement'),
          hasStep2: text.includes('Extracted Concept'),
          hasStep3: text.includes('Recommended Indian Standard'),
          hasStep4: text.includes('Official Source & Verification'),
          hasOpenOfficialSourceBtn: links.some(l => l.text.includes('Open official source') || l.text.includes('Verify on BIS')),
          hasTrustNotice: text.includes('ManakSetu provides standards intelligence'),
          hasLiveVerifRequired: text.includes('live verification required'),
          officialLinksInDrawer: links.filter(l => l.href.includes('bis.gov.in') || l.href.includes('crsbis.in') || l.href.includes('gem.gov.in'))
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Traceability Drawer Audit:', drawerAudit.result.value);

  // Close drawer
  await sendCommand('Runtime.evaluate', {
    expression: `
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close Traceability') || b.getAttribute('aria-label') === 'Close Traceability Drawer');
      if (closeBtn) closeBtn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 500));

  // 4. Click View Standard details modal
  console.log('Opening Standard Detail Modal...');
  await sendCommand('Runtime.evaluate', {
    expression: `
      const viewStdBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'View Standard');
      if (viewStdBtn) viewStdBtn.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  await captureScreenshot('ui_04_modal_open.png');

  const modalAudit = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href }));
        return {
          hasOfficialBadge: text.includes('OFFICIAL SOURCE'),
          hasLiveVerifRequired: text.includes('live verification required'),
          hasQcoPortalLink: links.some(l => l.text.includes('Compulsory Certification') || l.href.includes('compulsory-certification')),
          hasVerifyOnBisPortalBtn: links.some(l => l.text.includes('BIS Standards Portal — Verify Standard')),
          hasTrustNotice: text.includes('ManakSetu provides standards intelligence')
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Standard Detail Modal Audit:', modalAudit.result.value);

  ws.close();
  chromeProc.kill();
  console.log('UI Testing Complete!');
}

testUi().catch((err) => {
  console.error('Error testing UI:', err);
  process.exit(1);
});
