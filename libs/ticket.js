import prisma from './prisma'
import errorCode from './errorCode';

const getTicket = async function(filter, pagination) {
  let ticket;
  let total;
  let prismaArgs = {};

  if (filter) {
    prismaArgs['where'] = filter;
  }

  if (pagination) {
    prismaArgs['skip'] = parseInt(pagination.offset) || 0;
    prismaArgs['take'] = parseInt(pagination.limit) || 50;
  }

  total = await getTicketCount(filter);
  if (!total) {
    throw errorCode.BadRequest;
  }

  ticket = await prisma.ticket.findMany(prismaArgs);

  return { ticket, total };
}

const getTicketCount = async function(filter) {
  let count;
  let prismaArgs = {};

  prismaArgs['_count'] = { ticket_id: true };
  if (filter) {
    prismaArgs['where'] = filter;
  }

  count = await prisma.ticket.aggregate(prismaArgs);

  if (count) {
    return count._count.ticket_id;
  }

  return 0;
}

const createTicket = async function(data) {
  let examType;

  try {
    examType = await prisma.ticket.create({
      data
    });
  } catch (e) {
    throw errorCode.InternalServerError;
  }
  return examType;
}

export { getTicket, createTicket };