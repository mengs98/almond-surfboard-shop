import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: 'almond-surfboard-shop' }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

export default uploadProductImage;
