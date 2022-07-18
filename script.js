// check IndexedDB
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a IndexedDB");
}

// Open DB
const request = window.indexedDB.open("testDB", 2);

let DB = null;

request.onerror = () => {
  alert("Please allow to use IndexedDB");
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
    const objectStore2 = DB.createObjectStore("person", {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};

const createInput = document.getElementById("createInput");
const createBtn = document.getElementById("createBtn");
const getInput = document.getElementById("getInput");
const getBtn = document.getElementById("getBtn");

createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("createBtn click");

  if (DB === null) return;

  // transaction
  const transaction = DB.transaction(["person"], "readwrite");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.add({ name: createInput.value });
  request.onsuccess = (e) => {
    console.log(e.target.result);
  };
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("getBtn click");

  if (DB === null) return;

  const transaction = DB.transaction(["person"], "readonly");

  transaction.onerror = (e) => {
    console.error("transaction error");
    console.error(e);
  };
  transaction.oncomplete = () => {
    console.log("transaction complete");
  };

  const objectStore = transaction.objectStore("person");
  const request = objectStore.get(parseInt(getInput.value));
  request.onsuccess = (e) => {
    const result = e.target.result;
    console.log(result);
  };
});
