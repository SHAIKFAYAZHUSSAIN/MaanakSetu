async function verifyPdfLinks() {
  try {
    const res = await fetch('http://localhost:3000/api/export-pdf');
    const html = await res.text();
    console.log('HTML retrieved, length:', html.length);
    
    // Find all href matches
    const hrefMatches = [];
    const regex = /href="([^"]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      hrefMatches.push(match[1]);
    }
    
    console.log('Total hyperlinks in PDF:', hrefMatches.length);
    const unique = [...new Set(hrefMatches)];
    console.log('\nUnique Hyperlinks:');
    unique.forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
    
    const allowed = ['bis.gov.in', 'standards.bis.gov.in', 'manakonline.in', 'crsbis.in', 'gem.gov.in'];
    const invalid = unique.filter((u) => {
      try {
        const host = new URL(u).hostname;
        return !allowed.some((a) => host === a || host.endsWith('.' + a));
      } catch {
        return true;
      }
    });
    
    console.log('\nDisallowed / Unofficial URLs count:', invalid.length);
    if (invalid.length > 0) {
      console.error('FAIL: Found disallowed URLs:', invalid);
      process.exit(1);
    } else {
      console.log('SUCCESS: All hyperlinks strictly point to verified official domains!');
    }
  } catch (err) {
    console.error('Error verifying links:', err);
    process.exit(1);
  }
}

verifyPdfLinks();
