export interface Alert {
  id?: string;
  title: string;
  description: string;
  type: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  location: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  upvotes?: number;
  downvotes?: number;
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
} 