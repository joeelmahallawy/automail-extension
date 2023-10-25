import { google } from "googleapis"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getEnvironmentServerURL } from "~helpers"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { jwt } = await chrome.storage.local.get("jwt")

  console.log(`hello sir:`, req.body)
  const { email, threadId, sendAt } = req.body

  const scheduleEmail = await fetch(
    `${getEnvironmentServerURL()}/scheduleFollowUpEmail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ email, threadId, sendAt })
    }
  )
  // const scheduleEmail = await fetch(`${getEnvironmentServerURL()}`, {
  //   method: "GET"
  // })

  const response = await scheduleEmail.json()

  res.send(response)
}

export default handler
