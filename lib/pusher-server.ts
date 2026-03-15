import Pusher from 'pusher';

// Server-only — never import this in client components
export const pusherServer = new Pusher({
  appId:   process.env.PUSHER_APP_ID!,
  key:     process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret:  process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS:  true,
});

export const KITCHEN_CHANNEL = 'kitchen';
export const EVT_NEW_ORDER       = 'new-order';
export const EVT_ORDER_UPDATED   = 'order-updated';
