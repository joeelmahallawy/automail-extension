import { isEmpty } from "lodash"

import { getCookie, getEnvironmentWebsiteURL } from "~helpers"

// runs on all pages

;(async () => {
  const url = window.location.href

  // were on our website
  if (url.includes(getEnvironmentWebsiteURL())) {
    // get jwt from website
    const jwt = getCookie("jwt")

    // logged in on website
    if (jwt) {
      // but are they logged in on extension?
      // const jwtExists = await chrome.storage.local.get("jwt")

      // doesn't matter, we'll store the new JWT anyways because users can always switch accounts
      await chrome.storage.local.set({ jwt })
      // NOTE: let's assume that no1 will ever change their JWT and that if it exists, it's VALID
    }
  }
})()

export {}
