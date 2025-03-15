const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Lấy danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await getDB().collection('orders').find().toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
    }
};

// Lấy chi tiết đơn hàng kèm thông tin khách hàng và sản phẩm
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!ObjectId.isValid(orderId)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const db = getDB();

        // Tìm đơn hàng
        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        // Lấy thông tin khách hàng
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(order.id_user) },
            { projection: { _id: 0, full_name: 1, email: 1, phone: 1, address: 1 } }
        );

        // Lấy danh sách sản phẩm từ order_details
        const orderDetails = await db.collection('order_details').find({ orderId: order.orderId }).toArray();

        if (orderDetails.length === 0) return res.status(404).json({ message: 'Không có sản phẩm trong đơn hàng' });

        // Lấy danh sách productId dưới dạng mảng chuỗi
        const productIds = orderDetails.map(detail => detail.productId.toString());

        // Lấy thông tin sản phẩm từ collection products
        const products = await db.collection('products')
            .find({ productId: { $in: productIds } }, { projection: { _id: 0, productId: 1, title: 1 } })
            .toArray();

        // Tạo một Map để dễ dàng tra cứu sản phẩm theo productId
        const productMap = new Map(products.map(p => [p.productId, p.title]));

        // Kết hợp thông tin sản phẩm vào orderDetails
        const detailedProducts = orderDetails.map(detail => ({
            title: productMap.get(detail.productId.toString()) || 'Không xác định', // Lấy tên sản phẩm từ Map
            quantity: detail.quantity,
            unitPrice: detail.price,
            totalPrice: detail.quantity * detail.price
        }));

        res.json({
            orderId: order.orderId,
            customer: user, // Thông tin khách hàng
            total_price: order.total_price,
            status: order.status,
            type_payment: order.type_payment,
            created_at: order.created_at,
            products: detailedProducts // Danh sách sản phẩm đầy đủ thông tin
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error });
    }
};



// Tạo đơn hàng mới + Chi tiết đơn hàng
exports.createOrder = async (req, res) => {
    try {
        const { status, type_payment, id_user, products } = req.body;

        if (!id_user || !products) {
            return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        }

        if (!ObjectId.isValid(id_user)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        const db = getDB();

        // Kiểm tra người dùng có tồn tại không
        const user = await db.collection('users').findOne({ _id: new ObjectId(id_user) });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Lấy tất cả orderId theo mẫu "DHxxx"
        const orders = await db.collection('orders').find({ orderId: /^DH\d+$/ }).toArray();
        let newOrderNumber = 1; // Mặc định nếu chưa có đơn hàng nào

        if (orders.length > 0) {
            // Lọc và lấy số lớn nhất từ các orderId hợp lệ
            const orderNumbers = orders.map(order => {
                const match = order.orderId.match(/^DH(\d+)$/);
                return match ? parseInt(match[1], 10) : null;
            }).filter(num => num !== null); // Loại bỏ giá trị null

            if (orderNumbers.length > 0) {
                newOrderNumber = Math.max(...orderNumbers) + 1;
            }
        }

        const orderId = `DH${newOrderNumber}`;

        // Lấy thông tin sản phẩm
        const productIds = products.map(p => p.productId);
        const productList = await db.collection('products').find({ productId: { $in: productIds } }).toArray();

        if (productList.length !== products.length) {
            return res.status(400).json({ message: 'Một hoặc nhiều sản phẩm không tồn tại' });
        }

        // Tính tổng tiền đơn hàng và chuẩn bị dữ liệu cho order_details
        let total_price = 0;
        const orderDetails = products.map(p => {
            const productInfo = productList.find(prod => prod.productId === p.productId);
            if (!productInfo) {
                throw new Error(`Sản phẩm ${p.productId} không tồn tại`);
            }

            const price = productInfo.price;
            const total = p.quantity * price;
            total_price += total;

            return {
                orderId,
                productId: p.productId,
                quantity: p.quantity,
                price: price
            };
        });

        // Thêm đơn hàng vào collection orders
        const orderResult = await db.collection('orders').insertOne({
            total_price,
            status: status || 'pending',
            type_payment,
            id_user: new ObjectId(id_user),
            orderId,
            created_at: new Date()
        });

        // Thêm chi tiết đơn hàng vào collection order_details
        await db.collection('order_details').insertMany(orderDetails);

        res.status(201).json({ message: 'Thêm đơn hàng thành công', orderId, total_price });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
};


// Cập nhật đơn hàng
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID đơn hàng không hợp lệ' });
        }

        const { status, type_payment, products } = req.body;
        const db = getDB();

        // Kiểm tra đơn hàng có tồn tại không
        const existingOrder = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
        if (!existingOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        let updateFields = {};
        if (status) updateFields.status = status;
        if (type_payment) updateFields.type_payment = type_payment;

        // Nếu chỉ cập nhật trạng thái hoặc phương thức thanh toán
        if (Object.keys(updateFields).length > 0) {
            await db.collection('orders').updateOne(
                { _id: new ObjectId(orderId) },
                { $set: updateFields }
            );
        }

        // Nếu có cập nhật sản phẩm trong đơn hàng
        if (products && products.length > 0) {
            // Lấy danh sách `productId` để lấy giá từ collection `products`
            const productIds = products.map(p => p.productId); // Giữ nguyên kiểu string
            const productList = await db.collection('products').find({ productId: { $in: productIds } }).toArray();

            if (productList.length !== products.length) {
                return res.status(400).json({ message: 'Một hoặc nhiều sản phẩm không tồn tại' });
            }

            // Tính tổng tiền mới và chuẩn bị dữ liệu cho `order_details`
            let newTotalPrice = 0;
            const newOrderDetails = products.map(p => {
                const productInfo = productList.find(prod => prod.productId === p.productId);
                if (!productInfo) {
                    throw new Error(`Sản phẩm ${p.productId} không tồn tại`);
                }

                const price = productInfo.price;
                const total = p.quantity * price;
                newTotalPrice += total;

                return {
                    orderId: existingOrder.orderId,
                    productId: p.productId, // Giữ nguyên kiểu string
                    quantity: p.quantity,
                    price: price
                };
            });

            // Xóa chi tiết đơn hàng cũ
            await db.collection('order_details').deleteMany({ orderId: existingOrder.orderId });

            // Thêm chi tiết đơn hàng mới
            await db.collection('order_details').insertMany(newOrderDetails);

            // Cập nhật tổng tiền trong `orders`
            await db.collection('orders').updateOne(
                { _id: new ObjectId(orderId) },
                { $set: { total_price: newTotalPrice } }
            );
        }

        res.json({ message: 'Cập nhật đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng', error });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!ObjectId.isValid(orderId)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const db = getDB();

        // Lấy thông tin đơn hàng trước khi xóa để lấy orderId dạng string
        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        // Xóa chi tiết đơn hàng trước (dùng orderId từ đơn hàng)
        await db.collection('order_details').deleteMany({ orderId: order.orderId });

        // Xóa đơn hàng
        const result = await db.collection('orders').deleteOne({ _id: new ObjectId(orderId) });

        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        res.json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error });
    }
};

