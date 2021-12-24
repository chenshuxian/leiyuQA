/* eslint-disable import/no-anonymous-default-export */
import { getPrize, createPrize } from '../../../libs/prize';
import errorCode from '../../../libs/errorCode';
import { isLogin, isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: prize
 *     description: The prize
 * 
 * definitions:
 *   prize:
 *     type: object
 *     properties:
 *       prize_id:
 *         type: string
 *         description: The prize ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       prize_name:
 *         type: string
 *         description: The prize name
 *         example: Ipad
 *       prize_title:
 *         type: string
 *         description: The prize title
 *         example: 頭獎
 *       prize_image_url:
 *         type: string
 *         description: The prize image url
 *         example: /prize/gift1.png
 *       prize_num:
 *         type: Integer
 *         description: The number of prizes
 *         example: 1
 *       is_lottery:
 *         type: boolean 
 *         description: Is the lottery been drawn
 *         example: false
 *       is_delete:
 *         type: boolean 
 *         description: Is the file delete 
 *         example: false
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The prize created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The prize updated time
 *         example: 2021-10-03T03:00:03.000Z
 *   prizeList:
 *     type: object
 *     properties:
 *       prizeList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/prize'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     Prize:
 *       $ref: '#/definitions/prize'
 * 
 * /api/prize:
 *   get:
 *     tags:
 *       - prize
 *     summary: Get a list of prize
 *     description: Get a list of prize
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean      
 *       - name: isLottery
 *         in: query
 *         description: Is the lottery been drawn
 *         required: false
 *         schema:
 *           type: boolean
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
 *         description: A list of prize
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/prizeList'
 *   post:
 *     tags:
 *       - prize
 *     summary: Create a prize
 *     description: Create a new prize
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/prize'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/prize'
 */
export default async(req, res) => {
  const {
    query: { isDelete, isLottery, offset, limit },
    body: prizeData,
    method
  } = req

  let prize;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      // if (!await isLogin(req)) {
      //   res.status(401).json(errorCode.Unauthorized);
      //   return;
      // }

      if (isDelete !== undefined) {
        filter = { is_delete: isDelete === 'true' ? true : false };
      }

      if (isLottery !== undefined) {
        filter = { is_lottery: isLottery === 'true' ? true : false };
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ prize, total } = await getPrize(filter, pagination));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (prize) {
        res.status(200).json({ prizeList: prize, total });
        return;
      }
      break
    case 'POST':
      if (!await isAdmin(req)) {
        res.status(401).json(errorCode.Unauthorized);
        return;
      }

      if (!prizeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        prize = await createPrize(prizeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (prize) {
        res.status(201).json(prize);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};