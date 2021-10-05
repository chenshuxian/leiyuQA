import { getTicket } from '../../../libs/ticket'

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
 *         description: the exam ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       user_id:
 *         type: string
 *         description: the user ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       prize_id:
 *         type: string
 *         description: the prize ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
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
    query: { userId, offset, limit },
    method
  } = req

  let ticket;
  let total;
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      if (userId) {
        filter = { user_id: userId };
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        ({ ticket, total } = await getTicket(filter, pagination));
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }

      if (ticket) {
        res.status(200).json({ ticketList: ticket, total });
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json(`Internal Server Error`);
};