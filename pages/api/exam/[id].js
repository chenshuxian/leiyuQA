import { getExam, updateExam, deleteExam } from '../../../libs/exam'

/**
 * @swagger
 * /api/exam/{id}:
 *   get:
 *     tags:
 *       - exam
 *     summary: Get a exam
 *     description: Get a exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
 *   patch:
 *     tags:
 *       - exam
 *     summary: Update a exam
 *     description: Update a exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/exam'
 *     responses:
 *       200:
 *         description: exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
 *   delete:
 *     tags:
 *       - exam
 *     summary: Delete a exam
 *     description: Delete a exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the exam
 *         schema:
 *           type: string
 *       - in: query
 *         name: isDelete
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: exam
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
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
        exam = (await getExam({ exam_id: id }))[0];
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'PATCH':
      if (!examData) {
        res.status(400).json(`Bad Request`)
        return;
      }

      try {
        exam = await updateExam(id, examData);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'DELETE':
      try {
        exam = await deleteExam(id, isDelete === 'true' ? true : false);
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
    res.status(200).json(exam);
    return;
  }

  res.status(500).json(`Internal Server Error`)
};