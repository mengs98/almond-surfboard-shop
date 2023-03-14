import Order from '../models/Order.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import { checkPermissions } from '../utils/index.js';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1)
    throw new BadRequestError('No cart items provided');

  if (!tax || !shippingFee)
    throw new BadRequestError('Please provide tax and shipping fee');

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.productId });
    if (!dbProduct) throw new NotFoundError('Product not found');

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      productId: _id,
    };

    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }

  // calculate total
  const total = tax + shippingFee + subtotal;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    userId: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) throw new NotFoundError('Order not found');

  checkPermissions(req.user, order.userId);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};

const updateOrder = async (req, res) => {
  const { paymentIntent } = req.body;

  const order = await Order.findOne({ _id: req.params.id });
  if (!order) throw new NotFoundError('Order not found');

  checkPermissions(req.user, order.userId);

  order.paymentIntent = paymentIntent;
  order.status = 'Paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
};
