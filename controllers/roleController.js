const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await getDB().collection('roles').find().toArray();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy vai trò', error });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const role = await getDB().collection('roles').findOne({ _id: new ObjectId(id) });
        if (!role) return res.status(404).json({ message: 'Không tìm thấy vai trò' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy vai trò', error });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });

        const db = getDB();

        // Kiểm tra xem vai trò đã tồn tại chưa
        const existingRole = await db.collection('roles').findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Vai trò đã tồn tại' });
        }

        // Nếu chưa tồn tại, thêm mới
        const result = await db.collection('roles').insertOne({ name });
        res.status(201).json({ message: 'Thêm vai trò thành công', id: result.insertedId });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo vai trò', error });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        if (!name) {
            return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        }

        const db = getDB();

        // Kiểm tra xem vai trò mới có trùng với vai trò khác không (trừ chính nó)
        const existingRole = await db.collection('roles').findOne({ name, _id: { $ne: new ObjectId(id) } });
        if (existingRole) {
            return res.status(400).json({ message: 'Vai trò đã tồn tại' });
        }

        // Cập nhật vai trò
        const result = await db.collection('roles').updateOne(
            { _id: new ObjectId(id) },
            { $set: { name } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy vai trò' });
        }

        res.json({ message: 'Cập nhật vai trò thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật vai trò', error });
    }
};


exports.deleteRole = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('roles').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy vai trò' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa vai trò', error });
    }
};