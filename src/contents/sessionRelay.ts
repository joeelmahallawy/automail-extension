import type { PlasmoCSConfig } from "plasmo"

import { relayMessage } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://mail.google.com/*"]
}

relayMessage({
  name: "session"
})
relayMessage({
  name: "scheduleFollowUpEmail"
})
