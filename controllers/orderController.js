const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await getDB().collection('orders').find().toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const order = await getDB().collection('orders').findOne({ _id: new ObjectId(id) });
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { total_price, status, type_payment, id_user, email, quantity, product_id } = req.body;
        if (!total_price || !id_user || !product_id) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('orders').insertOne({
            total_price, status: status || 'pending', type_payment, id_user: new ObjectId(id_user), email, quantity, product_id, created_at: new Date()
        });
        res.status(201).json({ message: 'Thêm đơn hàng thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('orders').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng', error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('orders').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error });
    }
};