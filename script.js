// check IndexedDB
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a IndexedDB");
}

// Open DB
const request = window.indexedDB.open("testDB", 4);

let DB = null;

const OBJECT_NAME = "personName";

request.onerror = () => {
  alert("You must allow the use of IndexedDB");
};
request.onsuccess = () => {
  console.log("DB open success");
  DB = request.result;
};
request.onupgradeneeded = (e) => {
  console.log("onupgradeneeded");
  const DB = e.target.result;
  if (e.oldVersion < 1) {
    const objectStore1 = DB.createObjectStore("toon", {
      keyPath: "_id",
      autoIncrement: true,
    });
    objectStore1.createIndex("toon", "toon", { unique: false });
  }
  if (e.oldVersion < 2) {
    const objectStore = DB.createObjectStore("person", {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("personNameIndex", "name");
  }
  if (e.oldVersion < 3) {
    const objectStore = DB.createObjectStore(OBJECT_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });
    objectStore.createIndex("personNameIndex", "name");
  }
};

const CONSOLE = document.getElementById("console");
const createInput = document.getElementById("createInput");
const createBtn = document.getElementById("createBtn");
const getInput = document.getElementById("getInput");
const getBtn = document.getElementById("getBtn");
const deleteInput = document.getElementById("deleteInput");
const deleteBtn = document.getElementById("deleteBtn");
const putInput = document.getElementById("putInput");
const putBtn = document.getElementById("putBtn");
const cursorBtn = document.getElementById("cursorBtn");

const setConsole = (text) => {
  CONSOLE.innerText = text;
};

// Add
createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("createBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction([OBJECT_NAME], "readwrite");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore(OBJECT_NAME);
  const request = objectStore.add({ name: createInput.value });
  request.onsuccess = (e) => {
    console.log(e.target.result);
  };
});

// Get
getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("getBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction([OBJECT_NAME], "readonly");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore(OBJECT_NAME);
  const index = objectStore.index("personNameIndex");
  const request = index.get(getInput.value);
  request.onsuccess = (e) => {
    const result = e.target.result;
    console.log(result);
    if (result !== undefined) setConsole(result.name);
  };
});

// Delete
deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("deleteBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction([OBJECT_NAME], "readwrite");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore(OBJECT_NAME);
  const index = objectStore.index("personNameIndex");
  const idRequest = index.get(deleteInput.value);
  idRequest.onsuccess = (e) => {
    const request = objectStore.delete(e.target.result.id);
    request.onsuccess = (e) => {
      const result = e.target.result;
      console.log(result);
    };
  };
});

// Update(Put)
putBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("getBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction([OBJECT_NAME], "readwrite");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore(OBJECT_NAME);
  const request = objectStore.get(parseInt(getInput.value));
  request.onsuccess = (e) => {
    const result = e.target.result;
    result.name = putInput.value;

    const updateReq = objectStore.put(result);
    updateReq.onsuccess = (e) => {
      console.log(e.target.result);
    };
  };
});

// Cursor
cursorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("cursorBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction([OBJECT_NAME], "readonly");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore(OBJECT_NAME);
  const request = objectStore.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(`key: ${cursor.key}, name: ${cursor.value.name}`);
      cursor.continue();
      setConsole(cursor.value.name);
    } else {
      console.log("cursor end");
    }
  };
});
