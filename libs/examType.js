import prisma from './prisma'

const getExamType = async function(filter, pagination) {
  let examType;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  examType = await prisma.exam_type.findMany(prismaArgs);

  if (!examType || examType.length === 0) {
    throw { code: 404, msg: `Not Found` };
  }

  return examType;
}

const createExamType = async function(data) {
  let examType;

  try {
    examType = await prisma.exam_type.create({
      data
    });
  } catch (e) {
    throw { code: 500, msg: `Internal Server Error` };
  }

  return examType;
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
      throw { code: 404, msg: `Not Found` };
    }
    throw { code: 500, msg: `Internal Server Error` };
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
      throw { code: 404, msg: `Not Found` };
    }
    throw { code: 500, msg: `Internal Server Error` };
  }

  return examType;
}

export { getExamType, createExamType, updateExamType, deleteExamType };