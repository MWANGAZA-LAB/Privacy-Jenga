import { useState, useEffect } from 'react';

interface OfflineStorage {
  saveGameState: (gameState: any) => Promise<void>;
  loadGameState: () => Promise<any>;
  saveProgress: (progress: any) => Promise<void>;
  loadProgress: () => Promise<any>;
  queueAnalytics: (data: any) => Promise<void>;
  clearStorage: () => Promise<void>;
  isOnline: boolean;
  storageQuota: {
    used: number;
    available: number;
    percentage: number;
  };
}

interface StorageQuota {
  used: number;
  available: number;
  percentage: number;
}

export const useOfflineStorage = (): OfflineStorage => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageQuota, setStorageQuota] = useState<StorageQuota>({
    used: 0,
    available: 0,
    percentage: 0,
  });

  // Database name and version
  const DB_NAME = 'PrivacyJengaDB';
  const DB_VERSION = 1;

  // Initialize IndexedDB
  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          analyticsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  };

  // Generic save function
  const saveData = async (storeName: string, data: any, key: string = 'default'): Promise<void> => {
    try {
      const db = await initDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await store.put({ id: key, data, timestamp: Date.now() });
      
      console.log(`Data saved to ${storeName}`);
    } catch (error) {
      console.error(`Error saving to ${storeName}:`, error);
      throw error;
    }
  };

  // Generic load function
  const loadData = async (storeName: string, key: string = 'default'): Promise<any> => {
    try {
      const db = await initDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.data : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Error loading from ${storeName}:`, error);
      return null;
    }
  };

  // Save game state
  const saveGameState = async (gameState: any): Promise<void> => {
    await saveData('gameState', gameState, 'current');
  };

  // Load game state
  const loadGameState = async (): Promise<any> => {
    return await loadData('gameState', 'current');
  };

  // Save user progress
  const saveProgress = async (progress: any): Promise<void> => {
    await saveData('progress', progress, 'user');
  };

  // Load user progress
  const loadProgress = async (): Promise<any> => {
    return await loadData('progress', 'user');
  };

  // Queue analytics data for later sync
  const queueAnalytics = async (data: any): Promise<void> => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['analytics'], 'readwrite');
      const store = transaction.objectStore('analytics');
      
      await store.add({
        data,
        timestamp: Date.now(),
        synced: false,
      });
      
      console.log('Analytics data queued for sync');
    } catch (error) {
      console.error('Error queuing analytics:', error);
      throw error;
    }
  };

  // Clear all storage
  const clearStorage = async (): Promise<void> => {
    try {
      const db = await initDB();
      const storeNames = ['gameState', 'progress', 'analytics', 'settings'];
      
      const transaction = db.transaction(storeNames, 'readwrite');
      
      for (const storeName of storeNames) {
        const store = transaction.objectStore(storeName);
        await store.clear();
      }
      
      console.log('All storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  };

  // Calculate storage quota
  const calculateStorageQuota = async (): Promise<void> => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const available = estimate.quota || 0;
        const percentage = available > 0 ? (used / available) * 100 : 0;

        setStorageQuota({
          used: Math.round(used / 1024 / 1024 * 100) / 100, // MB
          available: Math.round(available / 1024 / 1024 * 100) / 100, // MB
          percentage: Math.round(percentage * 100) / 100,
        });
      }
    } catch (error) {
      console.error('Error calculating storage quota:', error);
    }
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial storage quota calculation
    calculateStorageQuota();

    // Periodic storage quota updates
    const quotaInterval = setInterval(calculateStorageQuota, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(quotaInterval);
    };
  }, []);

  // Sync analytics when online
  useEffect(() => {
    if (isOnline) {
      syncPendingAnalytics();
    }
  }, [isOnline]);

  // Sync pending analytics data
  const syncPendingAnalytics = async (): Promise<void> => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['analytics'], 'readwrite');
      const store = transaction.objectStore('analytics');
      
      const request = store.getAll();
      request.onsuccess = async () => {
        const pendingData = request.result.filter(item => !item.synced);
        
        for (const item of pendingData) {
          try {
            // Attempt to sync with server
            await fetch('/api/analytics', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(item.data),
            });
            
            // Mark as synced
            await store.put({ ...item, synced: true });
          } catch (error) {
            console.error('Failed to sync analytics item:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error syncing analytics:', error);
    }
  };

  return {
    saveGameState,
    loadGameState,
    saveProgress,
    loadProgress,
    queueAnalytics,
    clearStorage,
    isOnline,
    storageQuota,
  };
};
