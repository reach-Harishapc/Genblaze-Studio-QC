import { NextResponse } from 'next/server';
import { checkB2Status } from '@/lib/b2';

export async function GET() {
  try {
    const status = await checkB2Status();
    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Backblaze connection check failed' },
      { status: 500 }
    );
  }
}
