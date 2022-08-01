# IndexedDB

## Open DB

```javascript
const DB_NAME = "test"; // string
const DB_VERSION = 1; // unsigned long long
const request = window.indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = () => {};
request.onsuccess = () => {};
request.onupgradeneeded = () => {};
```

### onerror

```javascript
request.onerror = () => {
  alert("You must allow the use of IndexedDB");
};
```

### onsuccess

```javascript
let DB;

request.onsuccess = () => {
  console.log("DB open success");
  DB = request.result;
};
```

### onupgradeneeded

```javascript
request.onupgradeneeded = (e) => {
  const DB = e.target.result;
  if (e.oldVersion < 1) {
    DB.createObjectStore("toon", { keyPath: "_id" });
  }
  if (e.oldVersion < 2) {
    DB.createObjectStore("person", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};
```

## CRUD

### Create

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readwrite");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.add({ name: "cookie" });
  request.onsuccess = (e) => {
    console.log(e.target.result); // return key
  };
};
```

### Read

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readonly");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.get(1); // get by key
  request.onsuccess = (e) => {
    const result = e.target.result;
    console.log(result);
  };
};
```

### Update

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readwrite");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.get(1); //get by key
  request.onsuccess = (e) => {
    const result = e.target.result;
    result.name = "poky";

    const updateReq = objectStore.put(result);
    updateReq.onsuccess = (e) => {
      const result = e.target.result;
      console.log(result);
    };
  };
};
```

### Delete

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readwrite");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.delete(1); // delete by key
  request.onsuccess = (e) => {
    const result = e.target.result;
    console.log(result);
  };
};
```

## Cursor

### Get all

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readonly");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(`key: ${cursor.key}, name: ${cursor.value.name}`);
      cursor.continue();
    } else {
      console.log("cursor end");
    }
  };
};
```

## Index

### Create Index

```javascript
objectStore.createIndex("indexName", "keyPath", "indexOptionObject");
```

```javascript
request.onupgradeneeded = (e) => {
  console.log("onupgradeneeded");
  const DB = e.target.result;

  if (e.oldVersion < 2) {
    const objectStore = DB.createObjectStore("person", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("personNameIndex", "name", { unique: false });
  }
};
```

### Read by Index

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readonly");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const index = objectStore.index("personNameIndex");
  const request = index.get(getInput.value); // get by index (person.name)
  request.onsuccess = (e) => {
    const result = e.target.result;
    console.log(result);
  };
};
```

### Delete by Index

```javascript
request.onsuccess = () => {
  const DB = request.result;
  const transaction = DB.transaction(["person"], "readwrite");

  transaction.onerror = (e) => {
    console.log("transaction error");
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const index = objectStore.index("personNameIndex");
  const idRequest = index.get(deleteInput.value); // first get request by index
  idRequest.onsuccess = (e) => {
    // delete data using the id, found in index
    const request = objectStore.delete(e.target.result.id);
    request.onsuccess = (e) => {
      const result = e.target.result;
      console.log(result);
    };
  };
};
```
