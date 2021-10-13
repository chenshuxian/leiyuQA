import prisma from './prisma';
import errorCode from './errorCode';

const defaultGameRuleId = 'e6f56954-5d70-4dc5-90c8-de8598e9719a';

const getGameRuleById = async function(id) {
  id = id || defaultGameRuleId;
  let gameRule = await prisma.game_rule.findUnique({
    where: {
      game_rule_id: id
    }
  });

  return gameRule;
}

const upsertGameRule = async function(id, content) {
  id = id || defaultGameRuleId;
  let gameRule;

  try {
    gameRule = await prisma.game_rule.upsert({
      where: {
        game_rule_id: id
      },
      update: {
        game_rule_content: content
      },
      create: {
        game_rule_id: id,
        game_rule_content: content,
      }
    })
  } catch (e) {
    if (e.code === "P2025") {
      throw errorCode.NotFound;
    }
    throw errorCode.InternalServerError;
  }

  return gameRule;
}

export { getGameRuleById, upsertGameRule }