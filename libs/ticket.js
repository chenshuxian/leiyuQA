import prisma from './prisma'

const getTicket = async function(filter, pagination) {
  let ticket;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  ticket = await prisma.ticket.findMany(prismaArgs);

  if (!ticket || ticket.length === 0) {
    throw { code: 404, msg: `Not Found` };
  }

  return ticket;
}

const createTicket = async function(data) {
  let examType;

  try {
    examType = await prisma.ticket.create({
      data
    });
  } catch (e) {
    throw { code: 500, msg: `Internal Server Error` };
  }
  return examType;
}

export { getTicket, createTicket };