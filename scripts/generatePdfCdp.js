const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outPath = 'C:\\Users\\sfaya\\Downloads\\Official_Tender_Specification_LED_Street_Lighting.pdf';
  const targetUrl = 'http://localhost:3000/api/export-pdf';
  const port = 9333;

  console.log('Launching headless Chrome on port', port);
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.chrome-tmp'),
  ]);

  // Wait for Chrome to be ready
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data && data.webSocketDebuggerUrl) {
        console.log('Chrome is ready!');
        break;
      }
    } catch {}
  }

  // Create a new target page
  const newTargetRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: 'PUT',
  });
  const pageTarget = await newTargetRes.json();
  wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log('Page created, wsUrl:', wsUrl);

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pendingRequests = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve) => {
    ws.onopen = () => {
      console.log('WebSocket connected to Chrome page target');
      resolve();
    };
  });

  let pageLoadedResolve;
  const pageLoadedPromise = new Promise((r) => {
    pageLoadedResolve = r;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) {
        reject(new Error(msg.error.message));
      } else {
        resolve(msg.result);
      }
    }
    if (msg.method === 'Page.loadEventFired') {
      pageLoadedResolve();
    }
  };

  await sendCommand('Page.enable');
  console.log('Waiting for page load event...');
  await pageLoadedPromise;
  // Give 500ms for fonts and CSS to settle
  await new Promise((r) => setTimeout(r, 600));

  console.log('Calling Page.printToPDF with generateTaggedPDF: true...');
  const printResult = await sendCommand('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    generateTaggedPDF: true,
  });

  const pdfBuffer = Buffer.from(printResult.data, 'base64');
  fs.writeFileSync(outPath, pdfBuffer);
  console.log('PDF written successfully to', outPath, `(${pdfBuffer.length} bytes)`);

  ws.close();
  chromeProc.kill();
  console.log('Done!');
}

generatePdf().catch((err) => {
  console.error('Error generating PDF via CDP:', err);
  process.exit(1);
});
