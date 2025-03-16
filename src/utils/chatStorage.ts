
/**
 * Chat storage utility that uses IndexedDB to store and retrieve messages
 * This provides more reliable storage than localStorage with better concurrency handling
 */

import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  nickname: string;
}

const DB_NAME = 'shared_chat_db';
const STORE_NAME = 'chat_messages';
const DB_VERSION = 1;

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create an object store for chat messages
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Save a message
export const saveMessage = async (message: ChatMessage): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Convert Date to string for storage
      const messageToStore = {
        ...message,
        timestamp: message.timestamp.toISOString()
      };
      
      const request = store.put(messageToStore);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject("Error saving message");
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Error saving message:", error);
    toast({
      title: "Error",
      description: "Failed to save message",
      variant: "destructive"
    });
  }
};

// Get all messages
export const getAllMessages = async (): Promise<ChatMessage[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      const request = index.getAll();
      
      request.onsuccess = () => {
        const messages = request.result.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        resolve(messages);
      };
      
      request.onerror = () => reject("Error retrieving messages");
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
};

// Clear all messages
export const clearAllMessages = async (): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject("Error clearing messages");
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
};

// Get messages newer than a specific timestamp
export const getNewerMessages = async (since: Date): Promise<ChatMessage[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      // Get all messages and filter on the client side
      const request = index.getAll();
      
      request.onsuccess = () => {
        const messages = request.result
          .map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          .filter(msg => msg.timestamp > since);
        
        resolve(messages);
      };
      
      request.onerror = () => reject("Error retrieving messages");
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Error getting newer messages:", error);
    return [];
  }
};
