import { NextRequest, NextResponse } from 'next/server';
import { SCENARIO_LED } from '@/data/procurementScenarios';
import { generateOfficialTenderPdfHtml } from '@/lib/pdfTemplate';
import { SupportedLanguage } from '@/types/language';

export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get('lang') || 'en') as SupportedLanguage;
  const html = generateOfficialTenderPdfHtml(SCENARIO_LED.mockResult, lang);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = body.result || SCENARIO_LED.mockResult;
    const lang = (body.language || 'en') as SupportedLanguage;
    const html = generateOfficialTenderPdfHtml(result, lang);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
