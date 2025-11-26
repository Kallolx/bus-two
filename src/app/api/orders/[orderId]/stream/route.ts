import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const supabase = await createClient();

  // Create SSE stream
  const encoder = new TextEncoder();
  let lastStatus = 'waiting';

  // Get initial status
  const { data: initialOrder } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (initialOrder) {
    lastStatus = initialOrder.status;
  }

  const stream = new ReadableStream({
    async start(controller) {
      // Poll for status changes
      const interval = setInterval(async () => {
        const { data: order } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single();

        if (!order) {
          controller.close();
          clearInterval(interval);
          return;
        }

        if (order.status !== lastStatus) {
          lastStatus = order.status;
          const data = JSON.stringify({
            orderId,
            status: order.status,
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        // Close stream when order is ready
        if (order.status === 'ready' || order.status === 'completed') {
          clearInterval(interval);
        }
      }, 2000); // Check every 2 seconds

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
