import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authentication.js';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import uploadProductImage from '../controllers/uploadImageController.js';
import { getSingleProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions('admin'), createProduct);

router
  .route('/uploadImage')
  .post(authenticateUser, authorizePermissions('admin'), uploadProductImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

router.route('/:productId/reviews').get(getSingleProductReviews);

export default router;
