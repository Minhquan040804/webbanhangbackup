const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await getDB().collection('accounts').find().toArray();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy tài khoản', error });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const account = await getDB().collection('accounts').findOne({ _id: new ObjectId(id) });
        if (!account) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy tài khoản', error });
    }
};

exports.createAccount = async (req, res) => {
    try {
        const { username, password, role_id } = req.body;
        if (!username || !password || !role_id) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('accounts').insertOne({
            username, password, role_id: new ObjectId(role_id)
        });
        res.status(201).json({ message: 'Thêm tài khoản thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('accounts').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật tài khoản', error });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('accounts').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error });
    }
};