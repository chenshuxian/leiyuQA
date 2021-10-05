import prisma from './prisma'

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
    throw { code: 404, msg: `Not Found` };
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
    throw { code: 500, msg: `Internal Server Error` };
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
      throw { code: 404, msg: `Not Found` };
    }
    throw { code: 500, msg: `Internal Server Error` };
  }

  return exam;
}

const deleteExam = async function(examId, isDelete = false) {
  let exam;

  try {
    if (isDelete) {
      exam = await prisma.exam.delete({
        where: {
          exam_id: examId
        }
      })
    } else {
      exam = await prisma.exam.update({
        where: {
          exam_id: examId
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
    throw { code: 404, msg: `Not Found` };
  }

  return exam;
}

const checkAnswer = async function(answerData) {
  let count;
  let prismaArgs = {};

  if (!answerData || typeof answerData !== 'object') {
    return 0;
  }

  prismaArgs['_count'] = { exam_id: true };
  prismaArgs['where'] = {
    OR: Object.entries(answerData).map(([exam_id, exam_ans]) => {
      return {
        AND: [{ exam_id, exam_ans }]
      }
    })
  };

  count = await prisma.exam.aggregate(prismaArgs);

  if (count) {
    return count._count.exam_id;
  }

  return 0;
}

const getExamTypeId = async function(id) {
  let exam = (await getExam({ exam_id: id }))[0];

  return exam.exam_type_id;
}

export { getExam, createExam, updateExam, deleteExam, getExamRandom, checkAnswer, getExamTypeId };