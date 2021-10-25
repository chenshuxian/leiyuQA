/* eslint-disable import/no-anonymous-default-export */
import { getUserById, updateIsShare, updateUser } from '../../libs/user';
import errorCode from '../../libs/errorCode';
import { isLogin, getUserId } from '../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: User
 * 
 * definitions:
 *   user:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: User ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       name:
 *         type: string
 *         description: User name
 *         example: ZZ
 *       phone:
 *         type: string
 *         description: Phone
 *         example: 0933123456
 *       addr:
 *         type: string
 *         description: Address
 *         example: 金門
 *       last_play_time:
 *         type: string
 *         format: date-time
 *         description: The last play time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_shared:
 *         type: boolean 
 *         description: Is shared url to FB
 *         example: false
 *       is_played:
 *         type: boolean 
 *         description: Is played today
 *         example: false
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam type created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam type updated time
 *         example: 2021-10-03T03:00:03.000Z
 *
 * components:
 *   schemas:
 *     User:
 *       $ref: '#/definitions/user'
 * 
 * /api/me:
 *   get:
 *     tags:
 *       - user 
 *     summary: Get user info
 *     description: Get user info
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 *   put:
 *     tags:
 *       - user 
 *     summary: Auto update user info
 *     description: Auto update user isShared status at 00:00
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 *   patch:
 *     tags:
 *       - user 
 *     summary: Update user info
 *     description: Update user info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: ZZ
 *               phone:
 *                 type: string
 *                 description: Phone
 *                 example: '0933123456'
 *               addr:
 *                 type: string
 *                 description: Address
 *                 example: 金門
 *               is_shared:
 *                 type: boolean 
 *                 description: Is shared url to FB
 *                 example: false
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 */
export default async(req, res) => {
  const {
    body: userData,
    method
  } = req

  if (!await isLogin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let userId = await getUserId(req);
  let user;
  console.log(`method ${method}`)
  switch (method) {
    case 'GET':
      try {
        user = await getUserById(userId);
      } catch (e) {
        if (e === errorCode.NotFound) {
          res.status(401).json(errorCode.Unauthorized);
          return;
        }
      }

      res.status(200).json(user);
      return;
      break
    case 'PATCH':
      if (!userData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        user = await updateUser(userId, {
          name: userData.name,
          phone: userData.phone,
          addr: userData.addr,
          is_shared: userData.is_shared
        });
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (user) {
        res.status(200).json(user);
        return;
      }
      break
    case 'PUT':
        try {
          user = await updateIsShare();
        } catch (e) {
          res.status(e.statusCode).json(e);
          return;
        }
  
        if (user) {
          res.status(200).json(user);
          return;
        }
        break
    default:
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};