const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'WebBanHang';
let db;

async function connectDB() {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Kết nối MongoDB thành công: ${dbName}`);
}

function getDB() {
    if (!db) {
        throw new Error('❌ Chưa kết nối database!');
    }
    return db;
}

module.exports = { connectDB, getDB };
