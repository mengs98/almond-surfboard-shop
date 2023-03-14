import Review from '../models/Review.js';
import Product from '../models/Product.js';

import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import { checkPermissions } from '../utils/index.js';

const createReview = async (req, res) => {
  const { productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) throw new NotFoundError('Product not found');

  const alreadySubmittedReview = await Review.findOne({
    userId: req.user.userId,
    productId,
  });

  if (alreadySubmittedReview)
    throw new BadRequestError('Already submitted review for this product');

  req.body.userId = req.user.userId;

  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });

  if (!review) throw new NotFoundError('Review not found');

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });

  if (!review) throw new NotFoundError('Review not found');

  const { rating, title, feedback } = req.body;

  checkPermissions(req.user, review.userId);

  review.rating = rating;
  review.title = title;
  review.feedback = feedback;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });

  if (!review) throw new NotFoundError('Review not found');

  checkPermissions(req.user, review.userId);

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed!' });
};

const getSingleProductReviews = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
