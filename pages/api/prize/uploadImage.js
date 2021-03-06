import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';
import { uploadImage } from '../../../libs/uploadFile';

/**
 * @swagger
 * /api/prize/uploadImage:
 *   post:
 *     tags:
 *       - prize 
 *     summary: Upload a image
 *     description: Upload a image
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: The image URL
 *                   example: /prize/92994eade8cba6f5fd3eb3321a997bf82.png
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json(errorCode.MethodNotAllowed);
    return;
  }

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  return uploadImage(req, res, '/prize');
};

export const config = {
  api: {
    bodyParser: false,
  },
}