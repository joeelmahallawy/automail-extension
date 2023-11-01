import { google } from "googleapis"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getEnvironmentServerURL } from "~helpers"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const body = req.body

  const { jwt } = await chrome.storage.local.get("jwt")

  const getSession = await fetch(
    `${getEnvironmentServerURL()}/session${
      body?.withEmails ? "?withEmails=true" : ""
    }`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` }
    }
  )

  const { session } = await getSession.json()

  res.send(session)
}

export default handler
