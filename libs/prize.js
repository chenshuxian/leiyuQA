import prisma from './prisma';
import errorCode from './errorCode';

const getPrize = async function(filter, pagination) {
  let prize;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getPrizeCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  prize = await prisma.prize.findMany(prismaArgs);

  return { prize, total };
}

const getPrizeById = async function(id) {
  let prize = await prisma.prize.findUnique({
    where: {
      prize_id: id
    }
  });

  if (!prize) {
    throw errorCode.NotFound;
  }

  return prize;
}

const getPrizeCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { prize_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.prize.aggregate(prismaArgs);

  if (count) {
    return count._count.prize_id;
  }

  return 0;
}

const createPrize = async function(data) {
  let prize;

  try {
    prize = await prisma.prize.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return prize;
}

const updatePrize = async function(prizeId, data) {
  let prize;

  try {
    prize = await prisma.prize.update({
      where: {
        prize_id: prizeId
      },
      data
    })
  } catch (e) {
    console.log(`prize update : ${e}`)
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return prize;
}

const deletePrize = async function(prizeId, isDelete = false) {
  let prize;

  try {
    // prize = await prisma.prize.delete({
    //   where: {
    //     prize_id: prizeId
    //   }
    // });
    if (isDelete) {
      if (Array.isArray(prizeId)) {
        prize = await prisma.prize.deleteMany({
          where: {
            prize_id: { in: prizeId }
          }
        });
      } else {
        prize = await prisma.prize.delete({
          where: {
            prize_id: prizeId
          }
        });
      }
    } else {
      if (Array.isArray(prizeId)) {
        prize = await prisma.prize.updateMany({
          where: {
            prize_id: { in: prizeId }
          },
          data: {
            is_delete: true
          }
        });
      } else {
        prize = await prisma.prize.update({
          where: {
            prize_id: prizeId
          },
          data: {
            is_delete: true
          }
        });
      }
    }
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return prize;
}

export { getPrize, createPrize, updatePrize, deletePrize, getPrizeById };