import { NextRequest, NextResponse } from 'next/server';
import { listB2Assets, getB2SignedUrl } from '@/lib/b2';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyToSign = searchParams.get('signKey');

    if (keyToSign) {
      const signedUrl = await getB2SignedUrl(keyToSign, 3600);
      return NextResponse.json({ success: true, key: keyToSign, signedUrl });
    }

    const assets = await listB2Assets();
    return NextResponse.json({ success: true, count: assets.length, assets });
  } catch (error: any) {
    console.error('Error fetching B2 vault assets:', error);
    return NextResponse.json({ error: 'Failed to fetch B2 vault' }, { status: 500 });
  }
}
