import { getExamRandom } from '../../../../libs/exam'
import { isLogin } from '../../../libs/auth';

/**
 * @swagger
 * /api/exam/random/{examTypeId}:
 *   get:
 *     tags:
 *       - exam
 *     summary: Get a random list of exam
 *     description: Get a random list of exam
 *     parameters:
 *       - in: path
 *         name: examTypeId
 *         required: true
 *         description: ID of the exam type
 *         schema:
 *           type: string
 *       - in: query
 *         name: count
 *         description: exam count
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examList'
 */
export default async(req, res) => {
  const {
    query: { id, count },
    method,
  } = req

  if (!await isLogin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let exam
  switch (method) {
    case 'GET':
      try {
        exam = await getExamRandom({ exam_type_id: id }, count);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (exam) {
        res.status(200).json({ examList: exam });
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(`Internal Server Error`)
};