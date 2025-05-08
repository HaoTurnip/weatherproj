import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Alert } from '../models/alert.model';
import { Observable, from, map } from 'rxjs';
import firebase from 'firebase/compat/app';

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

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  async addAlert(alert: Omit<Alert, 'id'>): Promise<string> {
    try {
      console.log('Adding alert:', alert);
      
      // Convert dates to Firestore Timestamps
      const alertData = {
        ...alert,
        startTime: firebase.firestore.Timestamp.fromDate(new Date(alert.startTime)),
        endTime: firebase.firestore.Timestamp.fromDate(new Date(alert.endTime)),
        upvotes: 0,
        downvotes: 0,
        comments: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      console.log('Alert data to be saved:', alertData);
      const docRef = await this.firestore.collection('alerts').add(alertData);
      console.log('Alert added successfully with ID:', docRef.id);
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
} 