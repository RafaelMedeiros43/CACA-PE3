const DB_NAME = "CacaDB";
const DB_VERSION = 3;
let db;

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            db = e.target.result
            //tabela dos eventos
            if (!db.objectStoreNames.contains("eventos")) {
                db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true })
            }
            //tabela dos subscritores da newsletter
            if (!db.objectStoreNames.contains("subscritores")) {
                db.createObjectStore("subscritores", { keyPath: "email" });
            }
        }

        request.onsuccess = (e) => {
            db = e.target.result;
            resolve(db);
        };

        request.onerror = (e) => {
            console.error("Erro no IndexedDB:", e)
            reject("Erro ao abrir base de dados.")
        };
    });
}

function adicionarEventoDB(evento) {
    return new Promise((resolve) => {
        const transaction = db.transaction(["eventos"], "readwrite");
        const store = transaction.objectStore("eventos");
        store.add(evento).onsuccess = () => resolve();
    });
}


function carregarEventosDB() {
    return new Promise((resolve) => {
        const transaction = db.transaction(["eventos"], "readonly");
        const store = transaction.objectStore("eventos");
        store.getAll().onsuccess = (e) => resolve(e.target.result);
    });
}

function atualizarEventoDB(evento) {
    return new Promise((resolve) => {
        const transaction = db.transaction(["eventos"], "readwrite");
        const store = transaction.objectStore("eventos");
        store.put(evento).onsuccess = () => resolve();
    });
}
function removerEventoDB(id) {
    return new Promise((resolve) => {
        const transaction = db.transaction(["eventos"], "readwrite");
        const store = transaction.objectStore("eventos");
        store.delete(id).onsuccess = () => resolve();
    });
}

function adicionarSubscritorDB(subscritor) {
    return new Promise(function(resolve, reject) {
        const transaction = db.transaction(["subscritores"], "readwrite");
        const store = transaction.objectStore("subscritores");
        
        const pedido = store.add(subscritor);

        pedido.onsuccess = function() {
            resolve("Sucesso");
        };

        pedido.onerror = function() {
            reject("Este e-mail já está inscrito na nossa newsletter!"); 
        }
    })
}