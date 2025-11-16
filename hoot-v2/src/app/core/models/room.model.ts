export interface Room {
  _id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  roomId: string;
  senderId: string;
  audioUrl: string;
  duration?: number;
  createdAt: Date;
  isRead: boolean;
}

export interface CreateMessageRequest {
  audioBlob: Blob;
  hootId?: string;
  userId?: string;
}

export interface RoomResponse {
  success: boolean;
  data: Room;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
}
