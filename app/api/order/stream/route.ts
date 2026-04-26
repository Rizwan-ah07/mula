import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const encoder = new TextEncoder();

function sse(event: string, payload: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
}

export async function GET(req: Request) {
  const collection = await getOrdersCollection();
  const changeStream = collection.watch(
    [
      {
        $match: {
          operationType: { $in: ['insert', 'update', 'replace'] },
        },
      },
    ],
    { fullDocument: 'updateLookup' }
  );

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sse('connected', { ok: true }));

      const onAbort = async () => {
        await changeStream.close();
        controller.close();
      };

      req.signal.addEventListener('abort', onAbort);

      changeStream.on('change', (change) => {
        const document = change.fullDocument;
        if (!document) return;

        controller.enqueue(
          sse('order_change', {
            operationType: change.operationType,
            order: {
              ...document,
              _id: document._id.toString(),
            },
          })
        );
      });

      changeStream.on('error', async () => {
        await changeStream.close();
        controller.close();
      });
    },
    async cancel() {
      await changeStream.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
