import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CardData } from './cardDatabase';

interface YugiohDB extends DBSchema {
  cards: {
    key: number;
    value: CardData;
    indexes: { 'name': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'YugiohDB';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<YugiohDB>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<YugiohDB>(DB_NAME, DB_VERSION, {
      upgrade(db, _oldVersion, _newVersion, _transaction) {
        if (!db.objectStoreNames.contains('cards')) {
          const store = db.createObjectStore('cards', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
};

export const getSetting = async (key: string) => {
    const db = await getDB();
    return db.get('settings', key);
};

export const saveSetting = async (key: string, value: any) => {
    const db = await getDB();
    return db.put('settings', value, key);
};
