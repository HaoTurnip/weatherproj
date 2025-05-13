import firebase from 'firebase/compat/app';

/**
 * Interface for alert data in Firestore
 */
export interface AlertData {
  title: string;
  description: string;
  type: string;
  severity: string;
  location: string;
  startTime: firebase.firestore.Timestamp;
  endTime: firebase.firestore.Timestamp;
  userId: string;
  upvotes: number;
  downvotes: number;
  comments: any[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

/**
 * Interface for user activity records
 */
export interface UserActivity {
  id: string;
  userId: string;
  type: string;
  description: string;
  timestamp: Date;
} 