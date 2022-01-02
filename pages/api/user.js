/* eslint-disable import/no-anonymous-default-export */
import { getUser } from '../../libs/user';
import errorCode from '../../libs/errorCode';
import { isAdmin, getAdminName } from '../../libs/auth';

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
 */
export default async(req, res) => {
  const {
    query: { offset, limit },
    method
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let user;
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
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};