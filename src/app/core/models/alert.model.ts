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
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherAlert {
  id: string;
  title: string;
  type: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  description: string;
  startTime: Date;
  endTime: Date;
  area: string;
  source: string;
  isActive: boolean;
} 