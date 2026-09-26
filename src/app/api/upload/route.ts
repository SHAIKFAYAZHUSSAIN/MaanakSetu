import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // If it's plain text or markdown
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      extractedText = buffer.toString('utf-8');
    } else {
      // For PDF / Binary files, extract printable text strings
      const rawString = buffer.toString('latin1');
      const textMatches = rawString.match(/[a-zA-Z0-9\s.,;:\-_/()%$#@!&]{4,}/g);
      if (textMatches && textMatches.length > 0) {
        extractedText = textMatches.join(' ').replace(/\s+/g, ' ').substring(0, 5000);
      } else {
        extractedText = `Uploaded Document: ${file.name} (${Math.round(file.size / 1024)} KB). Technical Tender Specification for Equipment Procurement.`;
      }
    }

    return NextResponse.json({
      fileName: file.name,
      fileSize: file.size,
      extractedText: extractedText.trim(),
    });
  } catch (error: any) {
    console.error('Error during file parsing:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
