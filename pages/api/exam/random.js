import { getExamRandom } from '../../../libs/exam'

/**
 * @swagger
 * /api/exam/random:
 *   get:
 *     description: Random returns the exam
 *     responses:
 *       200:
 *         description: exam
 */
export default async(req, res) => {
  const {
    query: { examTypeId, count },
    method,
  } = req

  let exam
  switch (method) {
    case 'GET':
      try {
        exam = await getExamRandom({ exam_type_id: examTypeId }, count);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (exam) {
    res.status(200).json({ exam });
    return;
  }

  res.status(500).json(`Internal Server Error`)
};