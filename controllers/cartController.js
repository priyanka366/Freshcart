import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";
import { ProductVariant } from "../models/productVariantModel.js";

export const addItemToCartController = async (req, res) => {
  const { product, variant, quantity, price } = req.body;
  const userId = req.user._id; // Assuming user is authenticated and their ID is in the request

  try {
    let cart = await cartModel.findOne({ user: userId });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [{ product, variant, quantity, price }],
        totalAmount: quantity * price
      });
      await cart.save();
    } else {
      // If cart exists, add item to the cart or update the quantity
      const existingItem = cart.items.find(
        (item) => item.product.toString() === product && item.variant.toString() === variant
      );

      if (existingItem) {
        // If item already exists in cart, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If item doesn't exist, add it to the cart
        cart.items.push({ product, variant, quantity, price });
      }

      // Recalculate total amount
      cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

      await cart.save();
    }

    res.status(200).send({
      success: true,
      message: "Item added to cart successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error adding item to cart",
      error: error.message
    });
  }
};

export const getCartController = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ user: userId }).populate("items.product items.variant");

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Cart fetched successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching cart",
      error: error.message
    });
  }
};

export const updateItemQuantityInCartController = async (req, res) => {
  const { product, variant, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === product && item.variant.toString() === variant
    );

    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Update quantity
    item.quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Cart updated successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating cart",
      error: error.message
    });
  }
};

export const removeItemFromCartController = async (req, res) => {
  const { product, variant } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    // Find the item and remove it from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== product || item.variant.toString() !== variant
    );

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();

    res.status(200).send({
      success: true,
      message: "Item removed from cart successfully",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error removing item from cart",
      error: error.message
    });
  }
};

export const clearCartController = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
};
