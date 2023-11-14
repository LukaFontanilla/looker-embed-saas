let request;
let db;
let version = 1;

export const initDB = () => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open("myDB", 1);

    request.onupgradeneeded = (e) => {
      console.log("here");
      db = e.target.result;
      console.log("here: ", db);
      // if the data object store doesn't exist, create it
      if (
        !db.objectStoreNames.contains("chat") &&
        !db.objectStoreNames.contains("homepage")
      ) {
        console.log("Creating users store");
        db.createObjectStore("chat", { autoIncrement: true });
        db.createObjectStore("homepage", { autoIncrement: true });
        // { keyPath: 'id' });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;

      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

/**
 * @param {string} storeName the name of the indexdb store or table
 * @param {string} data the data to pass through and add to the store
 * @param {string} key the key for indexing and lookup
 */
export const addData = (storeName, data, key) => {
  return new Promise((resolve) => {
    request = indexedDB.open("myDB", version);

    request.onsuccess = () => {
      // console.log('request.onsuccess - addData', data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

/**
 * @param {string} storeName the name of the indexdb store or table
 */
export const deleteData = (storeName) => {
  return new Promise((resolve) => {
    request = indexedDB.open("myDB");

    request.onsuccess = () => {
      // console.log('request.onsuccess - deleteData');
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();
      resolve(true);
    };
  });
};

/**
 * @param {string} storeName the name of the indexdb store or table
 */
export const getStoreData = (storeName) => {
  return new Promise((resolve) => {
    request = indexedDB.open("myDB");

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};
