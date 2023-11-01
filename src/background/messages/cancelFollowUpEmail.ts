import { google } from "googleapis"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getEnvironmentServerURL } from "~helpers"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { id } = req.body
  const { jwt } = await chrome.storage.local.get("jwt")

  const cancelFollowUp = await fetch(
    `${getEnvironmentServerURL()}/cancelFollowUpEmail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ id })
    }
  )

  const response = await cancelFollowUp.json()

  console.log(response)
  res.send(response)
}

export default handler
