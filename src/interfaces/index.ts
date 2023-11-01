export type User = {
  id: string
  accessToken: string
  refreshToken: string
  googleUserId: string
  accessTokenExpirationDate: Date
  name: string
  email: string
  profilePicture: string
  ScheduledEmails?: ScheduledEmail[]
}

export type ScheduledEmail = {
  id: string
  threadId: string
  body: string
  sendAt: string
  userId: string
  recipients: string[]
}
