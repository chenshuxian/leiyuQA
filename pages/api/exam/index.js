import { getExam, createExam } from '../../../libs/exam'

/**
 * @swagger
 * tags:
 *   - name: exam
 *     description: The exam
 * 
 * definitions:
 *   exam:
 *     type: object
 *     properties:
 *       exam_id:
 *         type: string
 *         description: The exam ID
 *         example: 11c2b4f5-c270-454e-a834-ae569a31dc54
 *       exam_type_id:
 *         type: string
 *         description: The exam type ID
 *         example: 4034bd78-17c8-4919-93d5-d0f547a0401b
 *       exam_title:
 *         type: string
 *         description: The exam title
 *         example: 烈嶼受東北季風侵擾，先民為驅除風害...
 *       exam_option:
 *         type: array
 *         description: The exam option
 *         items:
 *           type: string
 *           example: 選項一
 *       exam_ans:
 *         type: integer
 *         description: The exam answer
 *         example: 1
 *       exam_img_url:
 *         type: string
 *         description: The exam image url
 *         example: /assets/images/qa/1.jpg
 *       exam_video_url:
 *         type: string
 *         description: The exam video url
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam updated time
 *         example: 2021-10-03T03:00:03.000Z
 *       is_delete:
 *         type: boolean 
 *         description: Is the exam deleted
 *         example: false
 *   examList:
 *     type: object
 *     properties:
 *       examList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/exam'
 *
 * components:
 *   schemas:
 *     Exam:
 *       $ref: '#/definitions/exam'
 * 
 * /api/exam:
 *   get:
 *     tags:
 *       - exam
 *     summary: Get a list of exam
 *     description: Get a list of exam
 *     parameters:
 *       - name: isDelete
 *         in: query
 *         description: is delete
 *         required: false
 *         schema:
 *           type: boolean
 *       - name: examTypeId
 *         in: query
 *         description: examTypeId
 *         required: false
 *         schema:
 *           type: string
 *       - name: offset
 *         in: query
 *         description: offset
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit 
 *         in: query
 *         description: limit
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
 *   post:
 *     tags:
 *       - exam
 *     summary: Create a exam
 *     description: Create a new exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/exam'
 *     responses:
 *       201:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/exam'
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

      if (exam) {
        res.status(200).json({ examList: exam });
        return;
      }
      break
    case 'POST':
      if (!examData) {
        res.status(400).json(`Bad Request`)
        return;
      }

      try {
        exam = await createExam(examData);
      } catch (e) {
        res.status(e.code).json(e.msg);
        return;
      }

      if (exam) {
        res.status(201).json(exam);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  res.status(500).json(`Internal Server Error`);
};