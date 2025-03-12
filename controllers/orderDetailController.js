const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await getDB().collection('order_details').find().toArray();
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error });
    }
};

exports.getOrderDetailById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const orderDetail = await getDB().collection('order_details').findOne({ _id: new ObjectId(id) });
        if (!orderDetail) return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        res.json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng', error });
    }
};

exports.createOrderDetail = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;
        if (!order_id || !product_id || !quantity || !price) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('order_details').insertOne({ order_id, product_id, quantity, price });
        res.status(201).json({ message: 'Thêm chi tiết đơn hàng thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo chi tiết đơn hàng', error });
    }
};

exports.updateOrderDetail = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('order_details').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết đơn hàng', error });
    }
};

exports.deleteOrderDetail = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('order_details').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn hàng' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa chi tiết đơn hàng', error });
    }
};