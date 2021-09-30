// This is an example of how to access a session from an API route
import { getSession } from 'next-auth/client'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const session = await getSession({ req })
  // console.log(`session ; ${JSON.stringify(session)}`)
  res.send(JSON.stringify(session, null, 2))
}