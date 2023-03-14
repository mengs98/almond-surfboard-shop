import mongoose from 'mongoose';

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    // price * amount (not include tax, shipping fee, and discount)
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ['Pending', 'Failed', 'Paid', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntent: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
