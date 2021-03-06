import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { createUser, getUserById } from "../../../libs/user"
import { adminLogin } from "../../../libs/auth"
import errorCode from "../../../libs/errorCode"
import { getAdminUserById } from "../../../libs/adminUser"

// 取出以下網址asid
// https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10158740544102775&height=50&width=50&ext=1635565413&hash=AeQ-Uqx_Vh1jY2iz-Uk
const getId = async (str) => {
  // console.log(str)
  let id;
  let start, end;
  start = str.indexOf("asid=") + 5;
  end = str.indexOf("&height");
  id = str.substring(start,end);
  return id;
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    // Providers.Email({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains
    /*
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
        }
      },
    }),
    Providers.Credentials({
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username'},
        password: { label: 'password', type: 'text', placeholder: 'Password'}
      },
      async authorize(credentials) {
        const admin = await adminLogin(credentials)

        return admin;
      }
    }),
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //   // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
    //   scope: "read:user"
    // }),
    // Providers.Google({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // Providers.Twitter({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Providers.Auth0({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   domain: process.env.AUTH0_DOMAIN,
    // }),
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  database: process.env.DATABASE_URL_AUTH,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn(user, account, profile) { 
      let registeredUser;
      // console.log(`user: ${JSON.stringify(user)} account: ${JSON.stringify(account)} profile: ${JSON.stringify(profile)}`)
      if (account.id === 'credentials') {
        user.email = user.name;

        return user;
      }

      try {
        registeredUser = await getUserById(user.id);
       
      } catch (e) {
       
        if (e === errorCode.NotFound) {
          try {
            registeredUser = await createUser({
              id: user.id,
              name: user.name
            });
          } catch (e) {
            return false;
          }
        }
      }

      return registeredUser ? true : false;
    },
    // async redirect(url, baseUrl) { return baseUrl },
    async session(session, user) { 
      // console.log(`sessionBak1: ${JSON.stringify(user)}`)
      let registeredUser;
      try {
        registeredUser = await getUserById(user.sub);
        session.reg = !!registeredUser.phone;
        session.userId = user.sub;
        session.user.phone = registeredUser.phone;
        session.user.addr = registeredUser.addr;
        session.user.is_shared = registeredUser.is_shared;
      } catch (e) {
        if (e === errorCode.NotFound) {
          try {
            registeredUser = await getAdminUserById(user.sub);
            session.userId = user.sub;
            session.isAdmin = true;
            session.isSuper = registeredUser.is_super
          } catch (e) {
          }
        }
      }

      return session 
    },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: 'light',

  // Enable debug messages in the console if you are having problems
  debug: false,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
   
  }
})
