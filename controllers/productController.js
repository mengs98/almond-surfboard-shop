import Product from '../models/Product.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, BadRequestError } from '../errors/index.js';

const createProduct = async (req, res) => {
  const { name } = req.body;

  const nameAlredyExists = await Product.findOne({ name });
  if (nameAlredyExists)
    throw new BadRequestError('Product with the same name already exists');

  req.body.userId = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) throw new NotFoundError('Product not found');

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) throw new NotFoundError('Product not found');

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) throw new NotFoundError('Product not found');

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Product deleted' });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
