export const runtime = 'nodejs'; // Ensure this is not 'edge'
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  return NextResponse.json({ message: 'Auth temporarily disabled for debugging' });
};

export const GET = async (req: Request) => {
  return NextResponse.json({ message: 'Auth temporarily disabled for debugging' });
};