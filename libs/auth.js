import { getToken } from 'next-auth/jwt';

const secret = process.env.SECRET
  
const isLogin = async function(req) {
  const token = await getToken({ req, secret });

  return token ? true : false;
}

const getUserId = async function(req) {
  const token = await getToken({ req, secret });

  return token ? token.sub : '';
}

export { isLogin, getUserId };