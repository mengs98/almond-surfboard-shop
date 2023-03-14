import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js';
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router
  .route('/')
  .post(authenticateUser, authorizePermissions('user'), createReview)
  .get(getAllReviews);

router
  .route('/:id')
  .get(authenticateUser, getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
