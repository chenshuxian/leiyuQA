/* eslint-disable import/no-anonymous-default-export */
import { getUser, createUser } from '../../libs/user';
import errorCode from '../../libs/errorCode';
import { isAdmin, getAdminName } from '../../libs/auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: The user
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
 *   userList:
 *     type: object
 *     properties:
 *       userList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/user'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     User:
 *       $ref: '#/definitions/user'
 * 
 * /api/user:
 *   get:
 *     tags:
 *       - user
 *     summary: Get a list of user
 *     description: Get a list of user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: offset
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit 
 *         in: query
 *         description: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/userList'
 *   post:
 *     tags:
 *       - user
 *     summary: Create a user
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/user'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/user'
 */
export default async(req, res) => {
  const {
    query: { offset, limit },
    body: userData,
    method
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let user;
  let data;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ user, total } = await getUser(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (user) {
        res.status(200).json({ userList: user, total });
        return;
      }
      break
    case 'POST':
      // if (!userData) {
      //   res.status(400).json(errorCode.BadRequest)
      //   return;
      // }
      // 自動生成測試帳號
      try {
        for(let i=0; i<100; i ++){
          data = {
            id: uuidv4(),
            name: `jacky${i}`
          }
          user = await createUser(data);
        }
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (user) {
        res.status(201).json(user);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET','POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};