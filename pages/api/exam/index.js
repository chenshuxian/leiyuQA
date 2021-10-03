import { getExam, createExam } from '../../../libs/exam'

/**
 * @swagger
 * /api/exam:
 *   get:
 *     description: Returns the exam
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         type: boolean
 *       - name: examTypeId
 *         in: query
 *         description: examTypeId
 *         required: false
 *         type: string
 *       - name: offset
 *         in: query
 *         description: offset
 *         required: false
 *         type: integer
 *       - name: limit 
 *         in: query
 *         description: limit
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: exam list
 *   post:
 *     description: Create the new exam
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: exam
 *         required: true
 *     responses:
 *       200:
 *         description: exam type
 *               
 */
export default async(req, res) => {
  const {
    query: { isDelete, examTypeId, offset, limit },
    body: examData,
    method
  } = req

  let exam
  switch (method) {
    case 'GET':
      let filter = {};
      let pagination;

      if (examTypeId) {
        filter['exam_type_id'] =  examTypeId;
      }

      if (isDelete !== undefined) {
        filter['is_delete'] = isDelete === 'true' ? true : false;
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        exam = await getExam(filter, pagination);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'POST':
      try {
        exam = await createExam(examData);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (exam) {
    res.status(200).json({ examList: exam });
    return;
  }

  res.status(500).json(`Internal Server Error`);
};