import { collection, onSnapshot } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { db, realtimeDb } from '../config/firebase';

let unsubscribe = null;

export const startUserSync = () => {
  // Only start sync if not already running
  if (unsubscribe) return;

  console.log('Starting user sync from Firestore to Realtime Database...');

  const usersRef = collection(db, 'users');
  
  unsubscribe = onSnapshot(usersRef, 
    (snapshot) => {
      const users = {};
      
      snapshot.docs.forEach((doc) => {
        users[doc.id] = {
          ...doc.data(),
          // Convert Firestore timestamps to readable format
          createdAt: doc.data().createdAt?.toDate?.()?.getTime() || doc.data().createdAt,
          lastLoginAt: doc.data().lastLoginAt?.toDate?.()?.getTime() || doc.data().lastLoginAt,
          lastSeenAt: doc.data().lastSeenAt?.toDate?.()?.getTime() || doc.data().lastSeenAt,
        };
      });

      // Write to Realtime Database
      const realtimeUsersRef = ref(realtimeDb, 'adminData/users');
      set(realtimeUsersRef, users)
        .then(() => {
          console.log(`Synced ${Object.keys(users).length} users to Realtime Database`);
        })
        .catch((error) => {
          console.error('Error syncing users to Realtime Database:', error);
        });
    },
    (error) => {
      console.error('Error listening to Firestore users:', error);
    }
  );
};

export const stopUserSync = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
    console.log('Stopped user sync');
  }
};

// Auto-start sync when this module is imported
startUserSync();