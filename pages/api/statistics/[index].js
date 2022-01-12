import { getDailyCount, getTotalCount, getCorrectAnswerCount, getDailyExamTypeCount } from '../../../libs/statistics';
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * tags:
 *   - name: statistics
 *     description: Statistics
 * 
 * definitions:
 *   dailyCount:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The daily ID
 *         example: 20211011
 *       number:
 *         type: integer
 *         description: Daily count
 *         example: 12345
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: Create time
 *         example: 2021-10-03T03:00:03.000Z
 *   dailyCountList:
 *     type: object
 *     properties:
 *       dailyCountList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/dailyCount'
 *       total:
 *         type: integer
 *         example: 1
 *   totalCount:
 *     type: object
 *     properties:
 *       total: 
 *         type: integer
 *         description: Total
 *         example: 12345
 *   examTypeCount:
 *     type: object
 *     properties:
 *       exam_type_name:
 *         type: string
 *         description: The exam type name
 *         example: 文化
 *       date:
 *         type: string
 *         description: Date
 *         format: date-time
 *         example: 2021-10-07
 *       count:
 *         type: integer
 *         description: Count
 *         example: 10
 *   examTypeCountList:
 *     type: object
 *     properties:
 *       dailyCountList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/examTypeCount'
 *       total:
 *         type: integer
 *         example: 1
 *
 * components:
 *   schemas:
 *     DailyCount:
 *       $ref: '#/definitions/dailyCount'
 * 
 * /api/statistics/dailyCount:
 *   get:
 *     tags:
 *       - statistics
 *     summary: Get a list of daily count
 *     description: Get a list of daily count
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date
 *       - name: endDate
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date
 *     responses:
 *       200:
 *         description: A list of daily count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/dailyCountList'
 * 
 * /api/statistics/totalCount:
 *   get:
 *     tags:
 *       - statistics
 *     summary: Total number of visits
 *     description: Total number of visits
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date
 *       - name: endDate
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date
 *     responses:
 *       200:
 *         description: Total number of visits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/totalCount'
 * 
 * /api/statistics/correctAnswerCount:
 *   get:
 *     tags:
 *       - statistics
 *     summary: Total number of correct answers
 *     description: Total number of correct answers
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date
 *       - name: endDate
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date
 *     responses:
 *       200:
 *         description: Total number of correct answers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/totalCount'
 * 
 * /api/statistics/dailyExamTypeCount:
 *   get:
 *     tags:
 *       - statistics
 *     summary: Get a list of exam type daily count
 *     description: Get a list of exam type daily count
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: Start date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date
 *       - name: endDate
 *         in: query
 *         description: End date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date
 *     responses:
 *       200:
 *         description: A list of exam type daily count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/examTypeCountList'
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
  const {
    query: { index, startDate, endDate },
    method
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let statistics;
  switch (method) {
    case 'GET':
      try {
        let dailyCountList
        switch (index) {
          case 'dailyCount':
            dailyCountList = await getDailyCount(startDate, endDate);
            statistics = { dailyCountList, total: dailyCountList.length };
            break;

          case 'totalCount':
            statistics = { total: await getTotalCount(startDate, endDate) };
            break;

          case 'correctAnswerCount':
            statistics = { total: await getCorrectAnswerCount(startDate, endDate) };
            break;

          case 'dailyExamTypeCount':
            dailyCountList =  await getDailyExamTypeCount(startDate, endDate);
            statistics = { dailyCountList, total: dailyCountList.length };
            break;
        }
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (statistics) {
        res.status(200).json(statistics);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};