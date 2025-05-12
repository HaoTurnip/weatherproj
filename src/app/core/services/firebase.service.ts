import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Alert } from '../models/alert.model';
import { Observable, from, map } from 'rxjs';
import firebase from 'firebase/compat/app';
import { collection, query, where, orderBy, getDocs, addDoc } from '@angular/fire/firestore';

interface AlertData {
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

interface UserActivity {
  id: string;
  userId: string;
  type: string;
  description: string;
  timestamp: Date;
}

interface Comment {
  id: string;
  alertId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  async addAlert(alert: Omit<Alert, 'id'>): Promise<string> {
    try {
      console.log('Adding alert:', alert);
      
      // Check if user is authenticated
      const user = this.firestore.firestore.app.auth().currentUser;
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User must be authenticated to create alerts');
      }

      console.log('Current user:', user.uid);

      // Convert dates to Firestore Timestamps
      const alertData = {
        ...alert,
        userId: user.uid, // Ensure we use the authenticated user's ID
        startTime: firebase.firestore.Timestamp.fromDate(new Date(alert.startTime)),
        endTime: firebase.firestore.Timestamp.fromDate(new Date(alert.endTime)),
        upvotes: 0,
        downvotes: 0,
        comments: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      console.log('Alert data to be saved:', alertData);
      
      // Add the alert document
      const docRef = await this.firestore.collection('alerts').add(alertData);
      console.log('Alert added successfully with ID:', docRef.id);

      // Add user activity for alert creation
      await this.addUserActivity({
        userId: user.uid,
        type: 'alert_created',
        description: `Created alert: ${alert.title}`,
        timestamp: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding alert:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create alert: ${error.message}`);
      }
      throw new Error('Failed to create alert: Unknown error');
    }
  }

  async getAlerts(): Promise<Alert[]> {
    try {
      console.log('Fetching alerts...');
      const snapshot = await this.firestore
        .collection('alerts', ref => ref.orderBy('createdAt', 'desc'))
        .get()
        .toPromise();
      
      console.log('Found', snapshot?.size, 'alerts');
      const alerts = snapshot?.docs.map(doc => {
        const data = doc.data() as AlertData;
        console.log('Processing alert document:', doc.id, data);
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          severity: data.severity,
          location: data.location,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate() || new Date(),
          userId: data.userId,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          comments: data.comments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Alert;
      }) || [];
      
      console.log('Processed alerts:', alerts);
      return alerts;
    } catch (error) {
      console.error('Error getting alerts:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to load alerts: ${error.message}`);
      }
      throw new Error('Failed to load alerts: Unknown error');
    }
  }

  async getAlertById(alertId: string): Promise<Alert | null> {
    try {
      console.log('Fetching alert by ID:', alertId);
      const doc = await this.firestore
        .collection('alerts')
        .doc(alertId)
        .get()
        .toPromise();
      
      if (!doc?.exists) {
        console.log('Alert not found:', alertId);
        return null;
      }

      const data = doc.data() as AlertData;
      console.log('Alert data:', data);
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        severity: data.severity,
        location: data.location,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate() || new Date(),
        userId: data.userId,
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
        comments: data.comments || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Alert;
    } catch (error) {
      console.error('Error getting alert:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to load alert: ${error.message}`);
      }
      throw new Error('Failed to load alert: Unknown error');
    }
  }

  async voteOnAlert(alertId: string, voteType: 'up' | 'down'): Promise<void> {
    try {
      console.log('Voting on alert:', alertId, voteType);
      const alertRef = this.firestore.collection('alerts').doc(alertId);
      const alertSnap = await alertRef.get().toPromise();
      
      if (!alertSnap?.exists) {
        throw new Error('Alert not found');
      }

      const updateData: { [key: string]: any } = {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (voteType === 'up') {
        updateData['upvotes'] = firebase.firestore.FieldValue.increment(1);
      } else {
        updateData['downvotes'] = firebase.firestore.FieldValue.increment(1);
      }

      await alertRef.update(updateData);
      console.log('Vote recorded successfully');
    } catch (error) {
      console.error('Error voting on alert:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to vote on alert: ${error.message}`);
      }
      throw new Error('Failed to vote on alert: Unknown error');
    }
  }

  async getAlertsByUser(userId: string): Promise<Alert[]> {
    try {
      console.log('Fetching alerts for user:', userId);
      const snapshot = await this.firestore
        .collection('alerts', ref => 
          ref.where('userId', '==', userId)
             .orderBy('createdAt', 'desc')
        )
        .get()
        .toPromise();
      
      console.log('Found', snapshot?.size, 'alerts for user');
      return snapshot?.docs.map(doc => {
        const data = doc.data() as AlertData;
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          severity: data.severity,
          location: data.location,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate() || new Date(),
          userId: data.userId,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          comments: data.comments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Alert;
      }) || [];
    } catch (error) {
      console.error('Error getting user alerts:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to load user alerts: ${error.message}`);
      }
      throw new Error('Failed to load user alerts: Unknown error');
    }
  }

  async getActiveAlerts(): Promise<Alert[]> {
    try {
      console.log('Fetching active alerts...');
      const now = new Date();
      const snapshot = await this.firestore
        .collection('alerts', ref => 
          ref.where('endTime', '>=', firebase.firestore.Timestamp.fromDate(now))
             .orderBy('endTime', 'asc')
        )
        .get()
        .toPromise();
      
      console.log('Found', snapshot?.size, 'active alerts');
      return snapshot?.docs.map(doc => {
        const data = doc.data() as AlertData;
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          severity: data.severity,
          location: data.location,
          startTime: data.startTime?.toDate() || new Date(),
          endTime: data.endTime?.toDate() || new Date(),
          userId: data.userId,
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
          comments: data.comments || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Alert;
      }) || [];
    } catch (error) {
      console.error('Error getting active alerts:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to load active alerts: ${error.message}`);
      }
      throw new Error('Failed to load active alerts: Unknown error');
    }
  }

  async deleteAlert(alertId: string): Promise<void> {
    try {
      await this.firestore.collection('alerts').doc(alertId).delete();
      console.log('Alert deleted successfully');
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw new Error('Failed to delete alert');
    }
  }

  async getUserAlerts(userId: string): Promise<Alert[]> {
    const snapshot = await this.firestore
      .collection<Alert>('alerts', ref => 
        ref.where('userId', '==', userId)
           .orderBy('startTime', 'desc')
      )
      .get()
      .toPromise();

    return snapshot?.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Alert)) || [];
  }

  async getUserActivity(userId: string): Promise<UserActivity[]> {
    const snapshot = await this.firestore
      .collection<UserActivity>('user_activity', ref => 
        ref.where('userId', '==', userId)
           .orderBy('timestamp', 'desc')
           .limit(50)
      )
      .get()
      .toPromise();

    return snapshot?.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id
      } as UserActivity;
    }) || [];
  }

  async addUserActivity(activity: Omit<UserActivity, 'id'>): Promise<void> {
    await this.firestore.collection('user_activity').add(activity);
  }

  async addComment(alertId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Get the authenticated user
      const user = this.firestore.firestore.app.auth().currentUser;
      if (!user) {
        throw new Error('User must be authenticated to add comments');
      }

      const commentData = {
        ...comment,
        userId: user.uid, // Always set to authenticated user's UID
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // First check if the alert exists
      const alertDoc = await this.firestore.collection('alerts').doc(alertId).get().toPromise();
      if (!alertDoc?.exists) {
        throw new Error('Alert not found');
      }

      const docRef = await this.firestore
        .collection('alerts')
        .doc(alertId)
        .collection('comments')
        .add(commentData);

      // Add activity record
      await this.addUserActivity({
        userId: user.uid,
        type: 'comment_added',
        description: `Added a comment to alert: ${alertId}`,
        timestamp: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          // For permission errors, we'll let the real-time listener handle the update
          return '';
        }
        throw new Error(`Failed to add comment: ${error.message}`);
      }
      throw new Error('Failed to add comment: Unknown error');
    }
  }

  getComments(alertId: string): Observable<Comment[]> {
    return this.firestore
      .collection('alerts')
      .doc(alertId)
      .collection('comments', ref => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map(snapshot => 
          snapshot.map(doc => ({
            id: doc.payload.doc.id,
            ...doc.payload.doc.data(),
            createdAt: doc.payload.doc.data()?.['createdAt']?.toDate() || new Date(),
            updatedAt: doc.payload.doc.data()?.['updatedAt']?.toDate() || new Date()
          } as Comment))
        )
      );
  }

  async updateComment(alertId: string, commentId: string, content: string): Promise<void> {
    try {
      await this.firestore
        .collection('alerts')
        .doc(alertId)
        .collection('comments')
        .doc(commentId)
        .update({
          content,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      // Add activity record
      const comment = await this.getComment(alertId, commentId);
      if (comment) {
        await this.addUserActivity({
          userId: comment.userId,
          type: 'comment_edited',
          description: `Edited a comment on alert: ${alertId}`,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  async deleteComment(alertId: string, commentId: string): Promise<void> {
    try {
      // Get the authenticated user
      const user = this.firestore.firestore.app.auth().currentUser;
      if (!user) {
        throw new Error('User must be authenticated to delete comments');
      }

      // Fetch the comment
      const comment = await this.getComment(alertId, commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Check ownership
      if (comment.userId !== user.uid) {
        throw new Error('You do not have permission to delete this comment');
      }

      await this.firestore
        .collection('alerts')
        .doc(alertId)
        .collection('comments')
        .doc(commentId)
        .delete();

      // Add activity record
      await this.addUserActivity({
        userId: user.uid,
        type: 'comment_deleted',
        description: `Deleted a comment from alert: ${alertId}`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Only throw if it's a real error, not a permission error that might be temporary
      if (error instanceof Error && !error.message.includes('permission')) {
        throw new Error('Failed to delete comment');
      }
      // For permission errors, we'll let the real-time listener handle the update
    }
  }

  private async getComment(alertId: string, commentId: string): Promise<Comment | null> {
    try {
      const doc = await this.firestore
        .collection('alerts')
        .doc(alertId)
        .collection('comments')
        .doc(commentId)
        .get()
        .toPromise();

      if (!doc?.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.['createdAt']?.toDate() || new Date(),
        updatedAt: doc.data()?.['updatedAt']?.toDate() || new Date()
      } as Comment;
    } catch (error) {
      console.error('Error getting comment:', error);
      return null;
    }
  }

  async getUserSettings(userId: string): Promise<any> {
    try {
      const doc = await this.firestore.collection('users').doc(userId).collection('settings').doc('preferences').get().toPromise();
      return doc?.data() || null;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw new Error('Failed to load user settings');
    }
  }

  async setUserSettings(userId: string, settings: any): Promise<void> {
    try {
      await this.firestore.collection('users').doc(userId).collection('settings').doc('preferences').set(settings, { merge: true });
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw new Error('Failed to save user settings');
    }
  }
} 