import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
      minlength: [5, 'Name should be at least 5 characters'],
      maxlength: [30, 'Name should be max 30 characters'],
      unique: [true, 'Product name with the same name is already exist'],
    },
    category: {
      type: String,
      enum: [
        'Surfboards',
        'T-shirts',
        'Hats',
        'Coffee Mugs & Cups',
        'Surf Accessories',
        'Surf Books',
      ],
      default: 'Surfboards',
    },
    images: {
      type: String,
      required: [true, 'Please provide image'],
    },
    status: {
      type: String,
      enum: ['Out of stock', 'Sale', 'New', 'On stock'],
      default: 'On stock',
    },
    stocks: {
      type: Number,
      required: [true, 'Please provide stocks'],
      default: 50,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      minlength: [30, 'Description must be at least 30 characters'],
      maxlength: [1000, 'Description should be max 1000 characters'],
    },
    bestFor: {
      type: String,
      required: [true, 'Please provide "best for "description'],
      minlength: [10, '"Best for" description must be at least 10 characters'],
      maxlength: [300, '"Best for" should be max 300 characters'],
    },
    dimensions: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

ProductSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.model('Review').deleteMany({ productId: this._id });
  }
);

export default mongoose.model('Product', ProductSchema);
