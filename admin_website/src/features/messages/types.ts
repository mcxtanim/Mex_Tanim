export interface AdminChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
  customerName?: string;
  customerPhone?: string;
}

export interface AdminChatThread {
  id: string;
  customerName: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: AdminChatMessage[];
}
