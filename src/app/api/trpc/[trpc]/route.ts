import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  return NextResponse.json({ message: 'tRPC temporarily disabled for debugging' });
};

export { handler as GET, handler as POST };