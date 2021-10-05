import { checkAnswer, getExamTypeId } from '../../../libs/exam';
import { createTicket } from '../../../libs/ticket';
import errorCode from '../../../libs/errorCode';

const passScore = 8;

/**
 * @swagger
 * /api/exam/submitAnswer:
 *   post:
 *     tags:
 *       - exam
 *     summary: Submit an exam answer
 *     description: Submit an exam answer to create a ticket
 *     requestBody:
 *       required: true
 *       description: Submit an exam answer to create a ticket
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: integer
 *               decription: Object key is exam_id, value is answer
 *               example: 1
 *     responses:
 *       201:
 *         description: Create a ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket_id:
 *                   type: string
 *                   description: The ticket ID
 *                   example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       400:
 *         description: It is not allowed to create a ticket because the answer is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The error code
 *                   example: IncorrectAnswer
 *                 msg:
 *                   type: string
 *                   description: The error message
 *                   example: It is not allowed to create a ticket because the answer is incorrect
 *       429:
 *         description: Daily quota exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The error code
 *                   example: QuotaExceeded
 *                 msg:
 *                   type: string
 *                   description: The error message
 *                   example: Daily quota exceeded
 */
export default async(req, res) => {
  const {
    body: answerData,
    method
  } = req

  let ticket
  switch (method) {
    case 'POST':
      let score;
      let isPass = false;
      let isQuotaExceeded = false;

      if (!answerData || typeof answerData !== 'object') {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      try {
        score = await checkAnswer(answerData);
        isPass = score >= passScore;
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (!isPass) {
        res.status(400).json(errorCode.IncorrectAnswer);
        return;
      }

      if (isQuotaExceeded) {
        res.status(400).json(errorCode.QuotaExceeded);
        return;
      }

      try {
        ticket = await createTicket({
          ticket_score: score,
          exam_type_id: await getExamTypeId(Object.keys(answerData)[0]),
          user_id: '10158740544102776' //TODO: use session to get userId
        });
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (ticket) {
        res.status(201).json(ticket);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      res.end()
  }

  res.status(500).json(errorCode.InternalServerError);
};