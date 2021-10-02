import { getExamType, updateExamType, deleteExamType } from '../../../libs/examType'

/**
 * @swagger
 * /api/examType/{id}:
 *   get:
 *     description: Returns the exam type
 *     responses:
 *       200:
 *         description: exam type
 *   patch:
 *     description: Update the exam type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: examTypeName
 *         in: formData
 *         description: exam_type_name
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: exam type
 *   delete:
 *     description: Delete the exam type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         type: boolean
 *     responses:
 *       200:
 *         description: exam type
 *               
 */
export default async(req, res) => {
  const {
    query: { id, isDelete },
    body: { examTypeName },
    method,
  } = req

  let examType
  switch (method) {
    case 'GET':
      try {
        examType = await getExamType({ exam_type_id: id });
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'PATCH':
      if (!examTypeName) {
        res.status(400).json(`Bad Request`)
        return;
      }

      try {
        examType = await updateExamType(id, examTypeName);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'DELETE':
      try {
        examType = await deleteExamType(id, isDelete);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (examType) {
    res.status(200).json({ examType });
    return;
  }

  res.status(500).json(`Internal Server Error`)
};