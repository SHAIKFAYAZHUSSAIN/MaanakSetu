const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9445;
  const tmpDir = path.join(__dirname, '../.chrome-verify-tmp');

  console.log('Launching headless Chrome on port', port);
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1536,900',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tmpDir,
  ]);

  try {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        const data = await res.json();
        if (data && data.webSocketDebuggerUrl) break;
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

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingRequests.has(msg.id)) {
        const { resolve, reject } = pendingRequests.get(msg.id);
        pendingRequests.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');
    await sendCommand('DOM.enable');

    console.log('Waiting for initial page load...');
    await new Promise((r) => setTimeout(r, 2500));

    // Helper: evaluate JS
    async function evaluate(expression) {
      const res = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
      });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.text || 'Eval error');
      }
      return res.result ? res.result.value : undefined;
    }

    // Helper: capture screenshot
    async function captureScreenshot(filename) {
      const { data } = await sendCommand('Page.captureScreenshot', { format: 'png' });
      const filepath = path.join(__dirname, filename);
      fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${filepath}`);
      return filepath;
    }

    // Helper: set viewport
    async function setViewport(width, height) {
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log('\n--- 1. Testing Workspace Width at 1536px (Landing View) ---');
    await setViewport(1536, 900);
    const landingMetrics = await evaluate(`
      (() => {
        const container = document.querySelector('.gov-workspace-container');
        const main = document.querySelector('main');
        const doc = document.documentElement;
        return {
          viewportWidth: window.innerWidth,
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          containerRatio: container ? (container.getBoundingClientRect().width / window.innerWidth) : 0,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasHorizontalScroll: doc.scrollWidth > doc.clientWidth
        };
      })()
    `);
    console.log('1536px Landing Metrics:', landingMetrics);
    await captureScreenshot('test_01_landing_1536_closed.png');

    console.log('\n--- 2. Navigating to Analysis Results View ---');
    // Click "Analysis Results" tab in quick nav
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('nav button'));
        const resultsBtn = buttons.find(b => b.textContent.includes('Analysis Results'));
        if (resultsBtn) resultsBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 600));

    const resultsMetrics = await evaluate(`
      (() => {
        const container = document.querySelector('.gov-workspace-container');
        const primaryCard = document.querySelector('.gov-card');
        const doc = document.documentElement;
        return {
          viewportWidth: window.innerWidth,
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          containerRatio: container ? (container.getBoundingClientRect().width / window.innerWidth) : 0,
          hasHorizontalScroll: doc.scrollWidth > doc.clientWidth,
          hasHeading: !!document.querySelector('h2'),
          headingText: document.querySelector('h2')?.textContent,
          hasPrimaryCard: !!primaryCard
        };
      })()
    `);
    console.log('1536px Analysis Results Metrics:', resultsMetrics);
    await captureScreenshot('test_02_results_1536_closed.png');

    console.log('\n--- 3. Testing Sidebar Open Behavior ---');
    // Click Hamburger button
    await evaluate(`
      (() => {
        const hamburgerBtn = document.querySelector('button[aria-label*="Navigation Drawer"]');
        if (hamburgerBtn) hamburgerBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const drawerOpenMetrics = await evaluate(`
      (() => {
        const drawer = document.querySelector('aside[aria-label="Navigation Drawer"]');
        const backdrop = document.querySelector('div.fixed.inset-0.z-50');
        const main = document.querySelector('main');
        const computedDrawer = drawer ? window.getComputedStyle(drawer) : null;
        const computedBackdrop = backdrop ? window.getComputedStyle(backdrop) : null;
        const computedMain = main ? window.getComputedStyle(main) : null;

        return {
          drawerExists: !!drawer,
          drawerWidth: drawer ? drawer.getBoundingClientRect().width : 0,
          drawerTransform: computedDrawer ? computedDrawer.transform : '',
          drawerZIndex: computedDrawer ? computedDrawer.zIndex : '',
          backdropFilter: computedBackdrop ? computedBackdrop.backdropFilter : '',
          backdropBg: computedBackdrop ? computedBackdrop.backgroundColor : '',
          mainFilter: computedMain ? computedMain.filter : '',
          mainOpacity: computedMain ? computedMain.opacity : '',
          isMainSharp: (!computedMain || computedMain.filter === 'none') && (!computedBackdrop || computedBackdrop.backdropFilter === 'none' || computedBackdrop.backdropFilter === '')
        };
      })()
    `);
    console.log('Drawer Open Metrics:', drawerOpenMetrics);
    await captureScreenshot('test_03_results_1536_drawer_open.png');

    console.log('\n--- 4. Testing Hamburger Toggle Close ---');
    await evaluate(`
      (() => {
        const hamburgerBtn = document.querySelector('button[aria-label*="Navigation Drawer"]');
        if (hamburgerBtn) hamburgerBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));
    const drawerClosed1 = await evaluate(`
      (() => {
        const drawer = document.querySelector('aside[aria-label="Navigation Drawer"]');
        const computed = drawer ? window.getComputedStyle(drawer) : null;
        return {
          transform: computed ? computed.transform : '',
          isHidden: drawer?.classList.contains('-translate-x-full')
        };
      })()
    `);
    console.log('After clicking hamburger again (should be closed):', drawerClosed1);

    console.log('\n--- 5. Testing Click-Outside Close ---');
    // Open drawer again
    await evaluate(`
      (() => {
        const hamburgerBtn = document.querySelector('button[aria-label*="Navigation Drawer"]');
        if (hamburgerBtn) hamburgerBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));
    // Click outside on the transparent backdrop overlay
    await evaluate(`
      (() => {
        const backdrop = document.querySelector('div.fixed.inset-0.z-50');
        if (backdrop) backdrop.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));
    const drawerClosed2 = await evaluate(`
      (() => {
        const drawer = document.querySelector('aside[aria-label="Navigation Drawer"]');
        return {
          isHidden: drawer?.classList.contains('-translate-x-full')
        };
      })()
    `);
    console.log('After clicking backdrop (should be closed):', drawerClosed2);

    console.log('\n--- 6. Testing Responsive Widths: 1280px & 1440px & 1600px ---');
    // 1280px
    await setViewport(1280, 800);
    const metrics1280 = await evaluate(`
      (() => {
        const container = document.querySelector('.gov-workspace-container');
        const doc = document.documentElement;
        return {
          viewportWidth: 1280,
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          ratio: container ? (container.getBoundingClientRect().width / 1280) : 0,
          hasHorizontalScroll: doc.scrollWidth > doc.clientWidth
        };
      })()
    `);
    console.log('1280px Viewport Metrics:', metrics1280);
    await captureScreenshot('test_04_results_1280.png');

    // 1440px
    await setViewport(1440, 900);
    const metrics1440 = await evaluate(`
      (() => {
        const container = document.querySelector('.gov-workspace-container');
        const doc = document.documentElement;
        return {
          viewportWidth: 1440,
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          ratio: container ? (container.getBoundingClientRect().width / 1440) : 0,
          hasHorizontalScroll: doc.scrollWidth > doc.clientWidth
        };
      })()
    `);
    console.log('1440px Viewport Metrics:', metrics1440);

    // 1600px
    await setViewport(1600, 950);
    const metrics1600 = await evaluate(`
      (() => {
        const container = document.querySelector('.gov-workspace-container');
        const doc = document.documentElement;
        return {
          viewportWidth: 1600,
          containerWidth: container ? container.getBoundingClientRect().width : 0,
          ratio: container ? (container.getBoundingClientRect().width / 1600) : 0,
          hasHorizontalScroll: doc.scrollWidth > doc.clientWidth
        };
      })()
    `);
    console.log('1600px Viewport Metrics:', metrics1600);
    await captureScreenshot('test_05_results_1600.png');

    console.log('\n--- All automated checks complete! ---');
    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

runVerification().catch(console.error);
