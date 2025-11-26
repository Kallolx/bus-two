import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stallId = searchParams.get('stallId');

  if (!stallId) {
    return NextResponse.json({ error: 'Stall ID is required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('enable_delivery, enable_dine_in, enable_digital_payment')
    .eq('id', stallId)
    .single();

  if (error) {
    console.error('Error fetching stall settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    enable_delivery: data?.enable_delivery ?? true,
    enable_dine_in: data?.enable_dine_in ?? true,
    enable_digital_payment: data?.enable_digital_payment ?? false,
  });
}
