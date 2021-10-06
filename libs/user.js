import prisma from './prisma';
import errorCode from './errorCode';

const getUser = async function(filter, pagination) {
  let user;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getUserCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  user = await prisma.user.findMany(prismaArgs);

  return { user, total };
}

const getUserCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.user.aggregate(prismaArgs);

  if (count) {
    return count._count.id;
  }

  return 0;
}

const createUser = async function(data) {
  let user;

  try {
    user = await prisma.user.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return user;
}

const updateExamType = async function(examTypeId, data) {
  let examType;

  try {
    examType = await prisma.exam_type.update({
      where: {
        exam_type_id: examTypeId
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return examType;
}

const deleteExamType = async function(examTypeId, isDelete = false) {
  let examType;

  try {
    if (isDelete) {
      examType = await prisma.exam_type.delete({
        where: {
          exam_type_id: examTypeId
        }
      })
    } else {
      examType = await prisma.exam_type.update({
        where: {
          exam_type_id: examTypeId
        },
        data: {
          is_delete: true
        }
      })
    }
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return examType;
}

export { getUser, createUser }