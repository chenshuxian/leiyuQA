import prisma from './prisma';
import errorCode from './errorCode';

const getExam = async function(filter, pagination) {
  let exam;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getExamCount(filter);
  if (!total) {
    throw errorCode.NotFound;
  }

  exam = await prisma.exam.findMany(prismaArgs);

  return { exam, total };
}

const getExamCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { exam_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.exam.aggregate(prismaArgs);

  if (count) {
    return count._count.exam_id;
  }

  return 0;
}

const getExamUnDeletedCount = async function(filter) {
  let count;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = Object.assign({ is_delete: false }, filter);
  }

  count = await getExamCount(filter);

  return count;
}

const createExam = async function(data) {
  let exam;

  try {
    exam = await prisma.exam.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }

  return exam;
}

const updateExam = async function(examId, data) {
  let exam;

  try {
    exam = await prisma.exam.update({
      where: {
        exam_id: examId
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return exam;
}

const deleteExam = async function(examId, isDelete = false) {
  let exam;

  try {
    if (isDelete) {
      if (Array.isArray(examId)) {
        exam = await prisma.exam.deleteMany({
          where: {
            exam_id: { in: examId }
          }
        });
      } else {
        exam = await prisma.exam.delete({
          where: {
            exam_id: examId
          }
        });
      }
    } else {
      if (Array.isArray(examId)) {
        exam = await prisma.exam.updateMany({
          where: {
            exam_id: { in: examId }
          },
          data: {
            is_delete: true
          }
        });
      } else {
        exam = await prisma.exam.update({
          where: {
            exam_id: examId
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

  return exam;
}

const getExamRandom = async function(filter, count = 10) {
  let exam;
  let examTotal, maxOffset, offset;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  examTotal = await getExamUnDeletedCount(filter);
  maxOffset = examTotal - count + 1;
  maxOffset = maxOffset > 0 ? maxOffset : 0;
  offset = parseInt(Math.random()*maxOffset);

  prismaArgs['skip'] = offset;
  prismaArgs['take'] = parseInt(count);

  exam = await prisma.exam.findMany(prismaArgs);

  if (!exam) {
    throw errorCode.NotFound;
  }

  return exam;
}

const checkAnswer = async function(answerData) {
  let exam;
  let prismaArgs = {};

  if (!answerData || typeof answerData !== 'object') {
    return 0;
  }

  prismaArgs['where'] = {
    OR: Object.entries(answerData).map(([exam_id, exam_ans]) => {
      return {
        AND: [{ exam_id, exam_ans: { not: exam_ans } }]
      }
    })
  };

  exam = await prisma.exam.findMany(prismaArgs);

  return exam || {};
}

const getExamTypeId = async function(id) {
  let exam = (await getExam({ exam_id: id }));

  return exam.total ? exam.exam[0].exam_type_id : '';
}

export { getExam, createExam, updateExam, deleteExam, getExamRandom, checkAnswer, getExamTypeId };