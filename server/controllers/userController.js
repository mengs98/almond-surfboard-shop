import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from '../errors/index.js';
import {
  attachCookiesToResponse,
  checkPermissions,
  createTokenUser,
} from '../utils/index.js';

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId, role: 'user' }); // only get single user and not admin
  if (!user) throw new NotFoundError('User not found');
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) throw new BadRequestError('Please provide all values');

  const user = await User.findOne({ _id: req.user.userId });

  checkPermissions(req.user, user._id);

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequestError('Please provide both values');

  const user = await User.findOne({ _id: req.user.userId });

  checkPermissions(req.user, user._id);

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid credentials');

  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
