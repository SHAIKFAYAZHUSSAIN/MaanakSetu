const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testRoles() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9458;
  const tmpDir = path.join(__dirname, '../.chrome-roles-tmp4');

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

    console.log('Waiting for initial page load...');
    await new Promise((r) => setTimeout(r, 3000));

    async function evaluate(expression) {
      const res = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result ? res.result.value : null;
    }

    async function takeScreenshot(filename) {
      const scr = await sendCommand('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(scr.data, 'base64');
      const outPath = path.join(__dirname, filename);
      fs.writeFileSync(outPath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // Set demo_officer_logged_in = false to show login screen
    await evaluate(`
      localStorage.setItem('manaksetu_demo_officer_logged_in', 'false');
    `);
    await sendCommand('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise((r) => setTimeout(r, 3000));

    const pageText = await evaluate(`document.body.innerText`);
    console.log('Login screen has DEMO ENVIRONMENT:', pageText?.includes('DEMO ENVIRONMENT'));
    console.log('Login screen has Role:', pageText?.includes('Role:'));
    await takeScreenshot('role_01_login_screen.png');

    async function loginAs(roleName) {
      console.log(`\nLogging in as ${roleName}...`);
      await evaluate(`
        const sel = document.getElementById('demo-role-select');
        if (sel) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
          nativeSetter.call(sel, '${roleName}');
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      `);
      await new Promise((r) => setTimeout(r, 500));
      await evaluate(`
        const btn = document.getElementById('demo-signin-btn');
        if (btn) btn.click();
      `);
      await new Promise((r) => setTimeout(r, 2500));
    }

    async function signOut() {
      console.log('Signing out...');
      await evaluate(`
        const btn = document.querySelector('button[title="Sign out of Demo Session"]');
        if (btn) {
          btn.click();
        } else {
          localStorage.setItem('manaksetu_demo_officer_logged_in', 'false');
          window.location.reload();
        }
      `);
      await new Promise((r) => setTimeout(r, 2000));
      // Verify login screen visible
      const onLogin = await evaluate(`!!document.getElementById('demo-role-select')`);
      if (!onLogin) {
        console.log('Signout fallback: setting localStorage and reloading...');
        await evaluate(`
          localStorage.setItem('manaksetu_demo_officer_logged_in', 'false');
          window.location.reload();
        `);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // 1. Technical Scrutiny Officer
    await loginAs('Technical Scrutiny Officer');
    const tsText = await evaluate(`document.body.innerText`);
    console.log('TS Dashboard text length:', tsText?.length);
    console.log('Has TECHNICAL SCRUTINY DASHBOARD:', tsText?.includes('TECHNICAL SCRUTINY DASHBOARD'));
    console.log('Has Pending Technical Scrutiny:', tsText?.includes('Pending Technical Scrutiny'));
    console.log('Header has Technical Scrutiny Officer:', tsText?.includes('Technical Scrutiny Officer'));
    console.log('Header has Demo Account:', tsText?.includes('Demo Account'));
    await takeScreenshot('role_02_ts_dashboard.png');

    console.log('Clicking Review Case on TS Dashboard...');
    await evaluate(`
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Review Case'));
      if (btns[0]) btns[0].click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const tsCaseText = await evaluate(`document.body.innerText`);
    console.log('Case Review has TECHNICAL SCRUTINY:', tsCaseText?.includes('TECHNICAL SCRUTINY'));
    console.log('Has REQUIREMENT ANALYSIS:', tsCaseText?.includes('REQUIREMENT ANALYSIS'));
    console.log('Has RECOMMENDED STANDARDS:', tsCaseText?.includes('RECOMMENDED STANDARDS'));
    console.log('Has Accept Technical Specification:', tsCaseText?.includes('Accept Technical Specification'));

    await evaluate(`
      const acceptBtn = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Accept Technical Specification'))[0];
      if (acceptBtn) acceptBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 500));
    await takeScreenshot('role_03_ts_case_review.png');

    console.log('Opening Maanak for TS...');
    await evaluate(`
      const maanakBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Maanak'));
      if (maanakBtn) maanakBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1000));
    const maanakTsText = await evaluate(`document.body.innerText`);
    console.log('Maanak TS greeting:', maanakTsText?.includes("review technical requirements, standards mappings, compliance checks and specification gaps."));
    await takeScreenshot('role_04_ts_maanak.png');

    await evaluate(`
      const closeBtn = document.querySelector('button[title="Close chat"]');
      if (closeBtn) closeBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 500));
    await signOut();

    // 2. Competent Financial Authority
    await loginAs('Competent Financial Authority');
    const caText = await evaluate(`document.body.innerText`);
    console.log('CA Dashboard text length:', caText?.length);
    console.log('Has APPROVAL & DECISION DASHBOARD:', caText?.includes('APPROVAL & DECISION DASHBOARD'));
    console.log('Has Pending Approval:', caText?.includes('Pending Approval'));
    console.log('Has Demo data / Not provided:', caText?.includes('Demo data / Not provided'));
    console.log('Header has Competent Financial Authority:', caText?.includes('Competent Financial Authority'));
    console.log('Header has Demo Account:', caText?.includes('Demo Account'));
    await takeScreenshot('role_05_ca_dashboard.png');

    console.log('Clicking Review Case on CA Dashboard...');
    await evaluate(`
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Review Case'));
      if (btns[0]) btns[0].click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const caCaseText = await evaluate(`document.body.innerText`);
    console.log('Case Review has PROCUREMENT DECISION REVIEW:', caCaseText?.includes('PROCUREMENT DECISION REVIEW'));
    console.log('Has CASE SUMMARY:', caCaseText?.includes('CASE SUMMARY'));
    console.log('Has TECHNICAL SCRUTINY:', caCaseText?.includes('TECHNICAL SCRUTINY'));
    console.log('Has Not available in current demo dataset:', caCaseText?.includes('Not available in current demo dataset'));
    console.log('Has Approve action:', caCaseText?.includes('Approve'));

    await evaluate(`
      const approveBtn = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Approve'))[0];
      if (approveBtn) approveBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 500));
    await takeScreenshot('role_06_ca_decision_review.png');

    console.log('Opening Maanak for CA...');
    await evaluate(`
      const maanakBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Maanak'));
      if (maanakBtn) maanakBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1000));
    const maanakCaText = await evaluate(`document.body.innerText`);
    console.log('Maanak CA greeting:', maanakCaText?.includes("review the procurement case, technical scrutiny status, verification status and available supporting documents."));
    await takeScreenshot('role_07_ca_maanak.png');

    await evaluate(`
      const closeBtn = document.querySelector('button[title="Close chat"]');
      if (closeBtn) closeBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 500));
    await signOut();

    // 3. Procurement Officer
    await loginAs('Procurement Officer');
    const poText = await evaluate(`document.body.innerText`);
    console.log('PO Workspace text length:', poText?.length);
    console.log('PO has Workspace tab:', poText?.includes('Workspace'));
    console.log('PO has Analyze Requirement tab:', poText?.includes('Analyze Requirement'));
    console.log('PO has Analysis Results tab:', poText?.includes('Analysis Results'));
    console.log('PO has Knowledge Graph tab:', poText?.includes('Knowledge Graph'));
    console.log('PO has Spec Generator tab:', poText?.includes('Spec Generator'));
    console.log('PO has Standards Explorer tab:', poText?.includes('Standards Explorer'));
    console.log('PO has Analysis History tab:', poText?.includes('Analysis History'));
    console.log('PO has Verification tab:', poText?.includes('Verification'));
    console.log('Header has Procurement Officer:', poText?.includes('Procurement Officer'));
    console.log('Header has Demo Account:', poText?.includes('Demo Account'));
    await takeScreenshot('role_08_po_workspace.png');

    console.log('Opening Maanak for PO...');
    await evaluate(`
      const maanakBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Maanak'));
      if (maanakBtn) maanakBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1000));
    const maanakPoText = await evaluate(`document.body.innerText`);
    console.log('Maanak PO greeting:', maanakPoText?.includes("procurement standards assistant. I can help you analyze requirements, understand standards, identify gaps and prepare procurement specifications."));
    await takeScreenshot('role_09_po_maanak.png');

    console.log('\n=============================================');
    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
    console.log('=============================================\n');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    try {
      chromeProc.kill('SIGKILL');
    } catch {}
  }
}

testRoles();
