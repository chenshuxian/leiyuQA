import { getPrizeById, updatePrize, deletePrize } from '../../../libs/prize'
import errorCode from '../../../libs/errorCode';
import { isAdmin } from '../../../libs/auth';

/**
 * @swagger
 * /api/prize/{id}:
 *   get:
 *     tags:
 *       - prize
 *     summary: Get a prize
 *     description: Get a prize
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the prize
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: prize
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/prize'
 *   patch:
 *     tags:
 *       - prize
 *     summary: Update a prize
 *     description: Update a prize
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the prize
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/prize'
 *     responses:
 *       200:
 *         description: prize
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/prize'
 *   delete:
 *     tags:
 *       - prize 
 *     summary: Delete a prize
 *     description: Delete a prize
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the prize
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: prize
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/prize'
 */
export default async(req, res) => {
  const {
    query: { id },
    body: prizeData,
    method,
  } = req

  if (!await isAdmin(req)) {
    res.status(401).json(errorCode.Unauthorized);
    return;
  }

  let prize
  switch (method) {
    case 'GET':
      try {
        prize = await getPrizeById(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'PATCH':
      if (!prizeData) {
        res.status(400).json(errorCode.BadRequest)
        return;
      }

      try {
        prize = await updatePrize(id, prizeData);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    case 'DELETE':
      try {
        prize = await deletePrize(id);
      } catch (e) {
        res.status(e.statusCode).json(e);
        return;
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).json(errorCode.MethodNotAllowed);
      return;
  }

  if (prize) {
    res.status(200).json(prize);
    return;
  }

  res.status(500).json(errorCode.InternalServerError)
};