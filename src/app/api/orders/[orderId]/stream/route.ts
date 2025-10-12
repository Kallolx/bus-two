import { NextRequest } from 'next/server';
import { orders } from '../../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;

  // Create SSE stream
  const encoder = new TextEncoder();
  let lastStatus = orders.get(orderId)?.status || 'waiting';

  const stream = new ReadableStream({
    start(controller) {
      // Poll for status changes
      const interval = setInterval(() => {
        const order = orders.get(orderId);
        if (!order) {
          controller.close();
          clearInterval(interval);
          return;
        }

        if (order.status !== lastStatus) {
          lastStatus = order.status;
          const data = JSON.stringify({
            orderId: order.id,
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
