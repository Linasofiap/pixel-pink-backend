const Order = require('./../models/Order')
const Product = require('./../models/Product')

const createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        let totalAmount = 0;
        const allProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    ok: false,
                    msg: `Product not found`
                });
            }

            totalAmount += product.price * item.quantity;

            allProducts.push({
                productId: item.productId,
                quantity: item.quantity,
            });
        }

        const order = new Order({
            products: allProducts,
            totalAmount
        });

        await order.save();

        return res.status(201).json({
            ok: true,
            msg: 'Order created successfully',
            order: order
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Please contact our support'
        });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                ok: false,
                msg: 'Order not found'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Order found',
            order: order
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Please contact our support'
        });
    }
};

module.exports = {
    createOrder,
    getOrderById
};