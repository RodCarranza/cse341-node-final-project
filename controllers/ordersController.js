const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const getAllOrders = async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('orders').find().toArray();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const db = getDB();
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(id)
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving order',
      error: error.message
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const db = getDB();

    const newOrder = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(newOrder);

    return res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const db = getDB();

    const updatedOrder = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updatedOrder
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating order',
      error: error.message
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const db = getDB();

    const result = await db.collection('orders').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting order',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
