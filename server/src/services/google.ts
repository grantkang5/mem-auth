import { google } from 'googleapis';
import { decode } from 'jsonwebtoken';
import { Response, Request } from 'express';

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid'
]
export const googleURL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
})

export const googleRedirectURL = async (_req: Request, res: Response) => {
  const redirectURL = googleURL
  res.send({ redirectURL })
}

export const googleSignin = async (req: Request, res: Response) => {
  console.log(req.params, req.body)
  console.log(req.query, req.param)
  const { code } = req.query;
  const tokens = await createGoogleTokens(code)
  // oauth2Client.setCredentials(tokens)

  const user = await decode(tokens.id_token)
  console.log(user)
  const user2 = await oauth2Client.getTokenInfo(tokens.access_token)

  console.log('user2: ', user2)
  res.send('HELLO WORLD')
}

export const createGoogleTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code)
  console.log('TOKENS: ', tokens)
  return tokens
}