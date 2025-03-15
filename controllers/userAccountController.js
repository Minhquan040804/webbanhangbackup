const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db'); // Kết nối đến DB

// Lấy danh sách tất cả tài khoản (có thể lọc theo role_id)
exports.getAllAccounts = async (req, res) => {
    try {
        const db = getDB();
        const { role_id } = req.query;

        let query = {};
        if (role_id && ObjectId.isValid(role_id)) {
            query.role_id = new ObjectId(role_id);
        }

        const accounts = await db.collection('accounts').find(query, { projection: { password: 0 } }).toArray();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tài khoản', error });
    }
};

// Tạo tài khoản mới
exports.createAccount = async (req, res) => {
    try {
        const { username, password, role_id } = req.body;
        if (!username || !password || !role_id) {
            return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        }

        if (!ObjectId.isValid(role_id)) {
            return res.status(400).json({ message: 'role_id không hợp lệ' });
        }

        const db = getDB();

        // Kiểm tra vai trò có tồn tại không
        const role = await db.collection('roles').findOne({ _id: new ObjectId(role_id) });
        if (!role) {
            return res.status(404).json({ message: 'Vai trò không tồn tại' });
        }

        // Thêm tài khoản
        const result = await db.collection('accounts').insertOne({
            username,
            password,
            role_id: new ObjectId(role_id)
        });

        res.status(201).json({ message: 'Tạo tài khoản thành công', account_id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error });
    }
};

// Cập nhật hoặc tạo thông tin user
exports.updateUser = async (req, res) => {
    try {
        const account_id = req.params.account_id;
        const { full_name, email, phone, address } = req.body;

        if (!ObjectId.isValid(account_id)) {
            return res.status(400).json({ message: 'account_id không hợp lệ' });
        }

        const db = getDB();

        // Kiểm tra tài khoản có tồn tại không
        const accountExists = await db.collection('accounts').findOne({ _id: new ObjectId(account_id) });
        if (!accountExists) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // Cập nhật hoặc tạo mới user
        const result = await db.collection('users').updateOne(
            { account_id: new ObjectId(account_id) },
            { $set: { full_name, email, phone, address, account_id: new ObjectId(account_id) } },
            { upsert: true }
        );

        res.json({ message: 'Cập nhật thông tin người dùng thành công', modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error });
    }
};

// Lấy thông tin người dùng theo account_id
exports.getUserByAccountId = async (req, res) => {
    try {
        const account_id = req.params.account_id;

        if (!ObjectId.isValid(account_id)) {
            return res.status(400).json({ message: 'account_id không hợp lệ' });
        }

        const db = getDB();
        const user = await db.collection('users').findOne(
            { account_id: new ObjectId(account_id) },
            { projection: { _id: 0, full_name: 1, email: 1, phone: 1, address: 1 } }
        );

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error });
    }
};

// Xóa user nhưng không ảnh hưởng đến account
exports.deleteUser = async (req, res) => {
    try {
        const account_id = req.params.account_id;

        if (!ObjectId.isValid(account_id)) {
            return res.status(400).json({ message: 'account_id không hợp lệ' });
        }

        const db = getDB();
        const result = await db.collection('users').deleteOne({ account_id: new ObjectId(account_id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng để xóa' });
        }

        res.json({ message: 'Xóa thông tin người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa thông tin người dùng', error });
    }
};

// Xóa account thì xóa luôn user
exports.deleteAccount = async (req, res) => {
    try {
        const account_id = req.params.account_id;

        if (!ObjectId.isValid(account_id)) {
            return res.status(400).json({ message: 'account_id không hợp lệ' });
        }

        const db = getDB();

        // Xóa user trước
        await db.collection('users').deleteOne({ account_id: new ObjectId(account_id) });

        // Xóa account
        const result = await db.collection('accounts').deleteOne({ _id: new ObjectId(account_id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản để xóa' });
        }

        res.json({ message: 'Xóa tài khoản và thông tin người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error });
    }
};
