import { getExamRandom } from '../../../../libs/exam'

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

  let exam
  switch (method) {
    case 'GET':
      try {
        exam = await getExamRandom({ exam_type_id: id }, count);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }

      if (exam) {
        res.status(200).json({ examList: exam });
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json(`Internal Server Error`)
};