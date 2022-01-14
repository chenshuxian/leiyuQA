import prisma from './prisma'
import errorCode from './errorCode';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const ticketMax = 200;

const getTicket = async function(filter, pagination, orderBy, includeRelation) {
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

  if (orderBy) {
    prismaArgs['orderBy'] = orderBy;
  }
 
  if (includeRelation) {
    prismaArgs['include'] = {
      exam_type: {
        select: {
          exam_type_name: true
        }
      },
      user: {
        select: {
          name: true,
          phone: true,
          addr: true
        }
      },
      month_prize: true,
      quarter_prize: true,
      year_prize: true
    };
  }

  total = await getTicketCount(filter);
  if (!total) {
    throw errorCode.NotFound;
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

const getTicketById = async function(id) {
  let ticket = await prisma.ticket.findUnique({
    where: {
      ticket_id: id
    }
  });

  if (!ticket) {
    throw errorCode.NotFound;
  }

  return ticket;
}

const updateTicket = async function(ticketId, data) {
  let ticket;

  try {
    ticket = await prisma.ticket.update({
      where: {
        ticket_id: ticketId
      },
      data
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return ticket;
}

const createTicket = async function(data) {
  let ticket;

  const now = dayjs();
  const uuid = uuidv4();
  const year = now.format('YYYY');
  const quarter = now.format('YYYY[Q]Q');
  const month = now.format('YYYYMM');
  const { user_id, exam_type_id, ticket_score } = data
  try {
    const result = await prisma.$executeRaw`INSERT INTO ticket(ticket_id, user_id, exam_type_id, ticket_score, month, quarter, year) SELECT ${uuid}, ${user_id}, ${exam_type_id}, ${ticket_score},
      (SELECT IF(COUNT(month)>=${ticketMax}, '0', ${month}) from ticket where user_id = ${user_id} AND month = ${month}),
      (SELECT IF(COUNT(quarter)>=${ticketMax}, '0', ${quarter}) from ticket where user_id = ${user_id} AND quarter = ${quarter}),
      (SELECT IF(COUNT(year)>=${ticketMax}, '0', ${year}) from ticket where user_id = ${user_id} AND year = ${year})`;
    if (result) {
      ticket = await getTicketById(uuid);
    }
  } catch (e) {
    throw errorCode.InternalServerError;
  }
  return ticket;
}

const drawTicket = async function(prizeId, number, drawRange) {
  let winnerList;
  let winnerIdList = [];

  //const [[range, time]] = Object.entries(drawRange);
  //const rangePrizeField = `${range}_prize_id`;
  const prize_top_id = '62a0cced-2800-11ec-8df4-0201a0fb495a';
  const rangePrizeField = `year_prize_id`;

  const queryTicketId = `SELECT ticket_id`
  const queryCount = `SELECT count(ticket_id) as count`
  const innerJoin = `INNER JOIN user on user.id = ticket.user_id`
  let lucky = 0;

  // 修改為都以年為抽獎單位
  if(prizeId == prize_top_id) {
    lucky = 1
  }
  const queryWhere2 = `FROM ticket ${innerJoin} WHERE ${rangePrizeField} IS NULL AND user.is_delete = 0 AND user.is_lucky = ${lucky} AND user_id NOT IN (SELECT user_id FROM ticket WHERE ${rangePrizeField} IS NOT NULL)`;

  const queryWhere = `FROM ticket ${innerJoin} WHERE ${rangePrizeField} IS NULL AND  user.is_delete = 0 AND user.is_lucky = 0 AND user_id NOT IN (SELECT user_id FROM ticket WHERE ${rangePrizeField} IS NOT NULL)`;
  // const queryWhere = `FROM ticket WHERE ${range} = '${time}' and ${rangePrizeField} IS NULL AND user_id NOT IN (SELECT user_id FROM ticket WHERE ${range} = '${time}' AND ${rangePrizeField} IS NOT NULL)`;
 
  try {
    for (let i = 0; i < number; i++) {
      let count;
      ([{ count }] = await prisma.$queryRawUnsafe(`${queryCount} ${queryWhere2}`));
      
      let offset = parseInt(Math.random()*count);

      let ticket = await prisma.$queryRawUnsafe(`${queryTicketId} ${queryWhere2} LIMIT ${offset}, 1`);
  
      if(lucky==1 && count == 0){
        ([{ count }] = await prisma.$queryRawUnsafe(`${queryCount} ${queryWhere}`));
        offset = parseInt(Math.random()*count);
        ticket = await prisma.$queryRawUnsafe(`${queryTicketId} ${queryWhere} LIMIT ${offset}, 1`);
      }

      if (ticket.length) {
        let ticketId = ticket[0].ticket_id;
        let data = {};
        data[rangePrizeField] = prizeId;

        ticket = await updateTicket(ticketId, data);

        winnerIdList.push(ticketId);
      }
    }

    winnerList = await prisma.ticket.findMany({
      where: {
        ticket_id: {
          in: winnerIdList
        }
      },
      include: {
        exam_type: {
          select: {
            exam_type_name: true
          }
        },
        user: {
          select: {
            name: true,
            phone: true,
            addr: true
          }
        },
        month_prize: true,
        quarter_prize: true,
        year_prize: true
      }
    });
  } catch (e) {
    console.log(e);
    throw errorCode.InternalServerError
  }

  return { winnerList, total: winnerList.length };
}

export { getTicket, createTicket, drawTicket };