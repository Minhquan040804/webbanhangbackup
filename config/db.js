const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Nhom12pmmnm:pmmnmNhom12@cluster0.vf8xv.mongodb.net/WebBanHang?retryWrites=true&w=majority';
let db;

async function connectDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db();
        console.log(`✅ Kết nối MongoDB Atlas thành công: WebBanHang`);
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('❌ Chưa kết nối database!');
    }
    return db;
}

module.exports = { connectDB, getDB };
