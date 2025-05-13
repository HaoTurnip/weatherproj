/**
 * Interface for comments on weather alerts
 */
export interface Comment {
  id: string;
  alertId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} 