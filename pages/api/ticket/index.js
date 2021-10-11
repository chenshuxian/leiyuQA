import { getTicket } from '../../../libs/ticket';
import errorCode from '../../../libs/errorCode';
import { isAdmin, isLogin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: ticket
 *     description: The ticket
 * 
 * definitions:
 *   ticket:
 *     type: object
 *     properties:
 *       ticket_id:
 *         type: string
 *         description: The ticket ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       ticket_score:
 *         type: integer
 *         description: The exam score
 *         example: 8
 *       exam_type_id:
 *         type: string
 *         description: The exam ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       user_id:
 *         type: string
 *         description: The user ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       month_prize_id:
 *         type: string
 *         description: The month prize ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       quarter_prize_id:
 *         type: string
 *         description: The quarter prize ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       year_prize_id:
 *         type: string
 *         description: The quarter prize ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       month:
 *         type: string
 *         description: The month of the draw
 *         example: 202110
 *       quarter:
 *         type: string
 *         description: The quarter of the draw
 *         example: 2021Q4
 *       year:
 *         type: string
 *         description: The year of the draw
 *         example: 2021
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
 *   ticketList:
 *     type: object
 *     properties:
 *       ticketList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/ticket'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     Ticket:
 *       $ref: '#/definitions/ticket'
 * 
 * /api/ticket:
 *   get:
 *     tags:
 *       - ticket
 *     summary: Get a list of ticket
 *     description: Get a list of ticket
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The user ID
 *         required: false
 *         schema:
 *           type: string
 *       - name: isWinner
 *         in: query
 *         description: Is winner
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: startDate
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date
 *       - name: endDate
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date
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
 *         description: A list of ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ticketList'
 */
export default async(req, res) => {
  const {
    query: { userId, isWinner, startDate, endDate, offset, limit },
    method
  } = req

  if (!await isLogin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let ticket;
  let total;
  switch (method) {
    case 'GET':
      let filter = {};
      let pagination;
      let orderBy;
      let includeRelation = await isAdmin();

      if (userId) {
        filter = { user_id: userId };
      }

      if (isWinner !== undefined ) {
        if (isWinner === 'true') {
          filter = Object.assign(filter, { OR: [
            { NOT: [{ month_prize_id: null }] },
            { NOT: [{ quarter_prize_id: null }] },
            { NOT: [{ year_prize_id: null }] },
          ]});
        } else {
          filter = Object.assign(filter, { AND: [
            { month_prize_id: null },
            { quarter_prize_id: null },
            { year_prize_id: null },
          ]});
        }
      }

      if (startDate) {
        if (!filter['AND']) {
          filter['AND'] = [];
        }

        filter['AND'].push({ create_time: { gte: new Date(startDate) }});
      }

      if (endDate) {
        if (!filter['AND']) {
          filter['AND'] = [];
        }

        filter['AND'].push({ create_time: { lte: new Date(endDate) }});
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      orderBy = [{ create_time: 'desc' }];

      try {
        ({ ticket, total } = await getTicket(filter, pagination, orderBy, includeRelation));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (ticket) {
        res.status(200).json({ ticketList: ticket, total });
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