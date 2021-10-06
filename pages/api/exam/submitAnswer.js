import { checkAnswer, getExamTypeId } from '../../../libs/exam';
import { createTicket } from '../../../libs/ticket';
import errorCode from '../../../libs/errorCode';
import { isLogin, getUserId } from '../../../libs/auth';

const passScore = 80;

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
 *                 score:
 *                   type: integer
 *                   description: Score
 *                   example: 80
 *                 ticket_id:
 *                   type: string
 *                   description: The ticket ID, empty if not passed
 *                   example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *                 ansList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exam_title:
 *                         type: string
 *                         description: The exam title
 *                         example: 烈嶼受東北季風侵擾，先民為驅除風害...
 *                       exam_ans:
 *                         type: string
 *                         description: Correct answer
 *                         example: 符籙 
 *                       exam_ans_err:
 *                         type: string
 *                         description: User answer
 *                         example:  木魚
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
 *                 message:
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
 *                 message:
 *                   type: string
 *                   description: The error message
 *                   example: Daily quota exceeded
 */
export default async(req, res) => {
  const {
    body: answerData,
    method
  } = req

  if (!await isLogin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let ticket
  switch (method) {
    case 'POST':
      let examAnsErr;
      let score;
      let isPass = false;
      let isQuotaExceeded = false;
      let ticketId;

      if (!answerData || typeof answerData !== 'object') {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      if (isQuotaExceeded) {
        res.status(400).json(errorCode.QuotaExceeded);
        return;
      }

      try {
        examAnsErr = await checkAnswer(answerData);
        if (examAnsErr) {
          score = (Object.keys(answerData).length - examAnsErr.length) * 10
          examAnsErr = examAnsErr.map( exam => {
            return {
              exam_title: exam.exam_title,
              exam_ans: exam.exam_option[exam.exam_ans - 1],
              exam_ans_err: exam.exam_option[answerData[exam.exam_id] - 1]
            };
          });
        } else {
          score = 100;
        }

        isPass = score >= passScore;
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (isPass) {
        try {
          ticket = await createTicket({
            ticket_score: score,
            exam_type_id: await getExamTypeId(Object.keys(answerData)[0]),
            user_id: await getUserId(req)
          });

          if (ticket) {
            ticketId = ticket.ticket_id;
          }
        } catch (e) {
          res.status(e.statusCode).json(e);
          return;
        }
      }

      res.status(200).json({
        score,
        ticket_id: ticketId,
        ansList: examAnsErr
      });
      return;
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};