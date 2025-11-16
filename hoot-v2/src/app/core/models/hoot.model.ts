export interface Hoot {
  _id: string;
  user: string; // User ID
  audioUrl: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  isRead?: boolean;
  likes?: number;
  replies?: number;
}

export interface CreateHootRequest {
  audioBlob: Blob;
  duration: number;
  metadata?: {
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface HootResponse {
  success: boolean;
  data: Hoot;
  message?: string;
}

export interface HootsResponse {
  success: boolean;
  data: Hoot[];
  hasMore?: boolean;
}
