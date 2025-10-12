import { NextRequest, NextResponse } from 'next/server';
import { categories, menuItems } from '@/data/mock-menu';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stallId = searchParams.get('stallId');

  // In a real app, filter by stallId
  return NextResponse.json({
    categories,
    items: menuItems,
  });
}
