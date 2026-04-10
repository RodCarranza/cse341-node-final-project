const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB();

    const cart = await db.collection('cart').findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving cart',
      error: error.message
    });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const db = getDB();

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await db.collection('cart').findOne({ userId });

    if (!cart) {
      const newCart = {
        userId,
        items: [
          {
            productId,
            quantity
          }
        ],
        totalPrice: Number(product.price) * Number(quantity),
        updatedAt: new Date()
      };

      await db.collection('cart').insertOne(newCart);

      return res.status(201).json({ message: 'Item added to cart successfully' });
    }

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    const totalPrice = await calculateCartTotal(cart.items, db);

    await db.collection('cart').updateOne(
      { userId },
      {
        $set: {
          items: cart.items,
          totalPrice,
          updatedAt: new Date()
        }
      }
    );

    return res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const db = getDB();

    const cart = await db.collection('cart').findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (!Array.isArray(cart.items)) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    const totalPrice = await calculateCartTotal(cart.items, db);

    await db.collection('cart').updateOne(
      { userId },
      {
        $set: {
          items: cart.items,
          totalPrice,
          updatedAt: new Date()
        }
      }
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const db = getDB();

    const cart = await db.collection('cart').findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (!Array.isArray(cart.items)) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const filteredItems = cart.items.filter((item) => item.productId !== productId);

    if (filteredItems.length === cart.items.length) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const totalPrice = await calculateCartTotal(filteredItems, db);

    await db.collection('cart').updateOne(
      { userId },
      {
        $set: {
          items: filteredItems,
          totalPrice,
          updatedAt: new Date()
        }
      }
    );

    return res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

const calculateCartTotal = async (items, db) => {
  let total = 0;

  for (const item of items) {
    if (!ObjectId.isValid(item.productId)) {
      continue;
    }

    const product = await db.collection('products').findOne({
      _id: new ObjectId(item.productId)
    });

    if (product) {
      total += Number(product.price) * Number(item.quantity);
    }
  }

  return total;
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart
};
