const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await getDB().collection('users').find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy người dùng', error });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const user = await getDB().collection('users').findOne({ _id: new ObjectId(id) });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy người dùng', error });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { account_id, full_name, email, phone, address } = req.body;
        if (!account_id || !full_name || !email) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('users').insertOne({
            account_id: new ObjectId(account_id), full_name, email, phone, address
        });
        res.status(201).json({ message: 'Thêm người dùng thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo người dùng', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('users').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng', error });
    }
};