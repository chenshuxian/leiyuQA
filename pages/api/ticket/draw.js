import { drawTicket } from '../../../libs/ticket';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * definitions:
 *   winner:
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
 *       exam_type:
 *         type: object
 *         description: The exam type object
 *         $ref: '#/definitions/examType'
 *       user:
 *         type: object
 *         description: The user object
 *         $ref: '#/definitions/user'
 *       month_prize:
 *         type: object
 *         description: The month prize object
 *         $ref: '#/definitions/prize'
 *       quarter_prize:
 *         type: object
 *         description: The quarter prize object
 *         $ref: '#/definitions/prize'
 *       year_prize:
 *         type: object
 *         description: The year prize object
 *         $ref: '#/definitions/prize'
 *   winnerList:
 *     type: object
 *     properties:
 *       winnerList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/winner'
 *       total:
 *         type: integer
 *         example: 1
 * 
 * components:
 *   schemas:
 *     Winner:
 *       $ref: '#/definitions/winner'
 * 
 * /api/ticket/draw:
 *   post:
 *     tags:
 *       - ticket
 *     summary: Lucky draw
 *     description: The list of winners
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: month
 *         in: query
 *         description: The month of the draw
 *         required: false
 *         schema:
 *           type: string
 *       - name: quarter
 *         in: query
 *         description: The quarter of the draw
 *         required: false
 *         schema:
 *           type: string
 *       - name: year
 *         in: query
 *         description: The year of the draw
 *         required: false
 *         schema:
 *           type: string
 *       - name: number
 *         in: query
 *         description: Number of draws
 *         required: true
 *         schema:
 *           type: integer
 *       - name: prize_id
 *         in: query
 *         description: The prize ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of winners
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/winnerList'
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  const {
    query: { month, quarter, year, number, prize_id },
    body: drawData,
    method
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let winnerList;
  let total;
  switch (method) {
    case 'POST':
      let drawRange;

      if (month) {
        drawRange = { month }
      }

      if (quarter) {
        drawRange = { quarter }
      }

      if (year) {
        drawRange = { year }
      }
     
      // if  (!drawRange) {
      //   res.status(400).json(errorCode.BadRequest);
      //   return;
      // }

      try {
        ({ winnerList, total } = await drawTicket(drawData.prize_id, drawData.number, drawRange));
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (winnerList) {
        res.status(200).json({ winnerList, total });
        return;
      }
      break
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};