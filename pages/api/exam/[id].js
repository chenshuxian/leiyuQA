import { getExam, updateExam, deleteExam } from '../../../libs/exam'

/**
 * @swagger
 * /api/exam/{id}:
 *   get:
 *     description: Returns the exam
 *     responses:
 *       200:
 *         description: exam
 *   patch:
 *     description: Update the exam
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: exam
 *         required: true
 *     responses:
 *       200:
 *         description: exam
 *   delete:
 *     description: Delete the exam
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         type: boolean
 *     responses:
 *       200:
 *         description: exam
 *               
 */
export default async(req, res) => {
  const {
    query: { id, isDelete },
    body: examData,
    method,
  } = req

  let exam
  switch (method) {
    case 'GET':
      try {
        exam = await getExam({ exam_id: id });
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'PATCH':
      try {
        exam = await updateExam(id, examData);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'DELETE':
      try {
        exam = await deleteExam(id, isDelete);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (exam) {
    res.status(200).json({ exam });
    return;
  }

  res.status(500).json(`Internal Server Error`)
};