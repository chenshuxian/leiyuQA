import { getGameRuleById, upsertGameRule } from '../../libs/gameRule'
import errorCode from '../../libs/errorCode';

/**
 * @swagger
 * tags:
 *   - name: gameRule
 *     description: gameRule
 * 
 * definitions:
 *   gameRule:
 *     type: object
 *     properties:
 *       game_rule_id:
 *         type: string
 *         description: Game rule ID
 *         example: e6f56954-5d70-4dc5-90c8-de8598e9719a
 *       game_rule_content:
 *         type: string
 *         description: Game rule
 *         example: 每日有一次遊戲機會
 *       create_time:
 *         type: string
 *         format: date-time
 *         description: The exam type created time
 *         example: 2021-10-03T03:00:03.000Z
 *       update_time:
 *         type: string
 *         format: date-time
 *         description: The exam type updated time
 *         example: 2021-10-03T03:00:03.000Z
 *
 * components:
 *   schemas:
 *     GameRule:
 *       $ref: '#/definitions/gameRule'
 * 
 * /api/gameRule:
 *   get:
 *     tags:
 *       - gameRule
 *     summary: Get game rule
 *     description: Get game rule
 *     responses:
 *       200:
 *         description: Game rule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/gameRule'
 *   put:
 *     tags:
 *       - gameRule
 *     summary: Update game rule
 *     description: Update game rule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_rule_content:
 *                 type: string
 *                 description: Game rule
 *                 example: 每日有一次遊戲機會
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/gameRule'
 */
export default async(req, res) => {
  const {
    body: gameRuleData,
    method
  } = req

  let gameRule;
  switch (method) {
    case 'GET':
      gameRule = await getGameRuleById();

      res.status(200).json(gameRule || {});
      return;
      break
    case 'PUT':
      if (!gameRuleData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        gameRule = await upsertGameRule(null, gameRuleData?.game_rule_content);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }

      if (gameRule) {
        res.status(200).json(gameRule);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  res.status(500).json(errorCode.InternalServerError);
};