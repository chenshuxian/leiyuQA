import { getExamType, createExamType } from '../../../libs/examType'

/**
 * @swagger
 * /api/examType:
 *   get:
 *     description: Returns the exam type
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         type: boolean
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
 *         description: exam type list
 *   post:
 *     description: Create the new exam type
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
 *               
 */
export default async(req, res) => {
  const {
    query: { isDelete, offset, limit },
    body: { examTypeName },
    method
  } = req

  let examType
  switch (method) {
    case 'GET':
      let filter;
      let pagination;

      if (isDelete !== undefined) {
        filter = { is_delete: isDelete === 'true' ? true : false };
      }

      if (offset || limit) {
        pagination = { offset, limit };
      }

      try {
        examType = await getExamType(filter, pagination);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    case 'POST':
      if (!examTypeName) {
        res.status(400).json(`Bad Request`)
        return;
      }

      try {
        examType = await createExamType(examTypeName);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (examType) {
    res.status(200).json({ examTypeList: examType });
    return;
  }

  res.status(500).json(`Internal Server Error`);
};