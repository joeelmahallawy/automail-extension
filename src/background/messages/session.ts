import { google } from "googleapis"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getEnvironmentServerURL } from "~helpers"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`before the jwt`)
  const { jwt } = await chrome.storage.local.get("jwt")
  console.log(`the jwt`, jwt)
  const getSession = await fetch(`${getEnvironmentServerURL()}/session`, {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` }
  })

  const { session } = await getSession.json()

  // console.log(`and session:`, session)
  res.send(session)
}

export default handler
