import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title must be max 100 characters'],
    },
    feedback: {
      type: String,
      required: [true, 'Please provide feedback'],
      minlength: [2, 'Feedback must be at least 2 characters'],
      maxlength: [500, 'Feedback should be max 500 characters'],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index;
({ productId: 1, userId: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  await this.model('Product').findOneAndUpdate(
    { _id: productId },
    {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: result[0]?.numOfReviews || 0,
    }
  );
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.productId);
});

ReviewSchema.post('deleteOne', async function () {
  await this.constructor.calculateAverageRating(this.productId);
});

export default mongoose.model('Review', ReviewSchema);
