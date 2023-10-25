import { isEmpty } from "lodash"

import { getCookie, getEnvironmentWebsiteURL } from "~helpers"

// runs on all pages

;(async () => {
  const url = window.location.href

  // were on our website
  if (url.includes(getEnvironmentWebsiteURL())) {
    // get jwt from website
    const jwt = getCookie("jwt")

    if (jwt) {
      // check if user is logged in
      const jwtExists = await chrome.storage.local.get("jwt")

      // jwt isn't stored in chrome storage
      if (isEmpty(jwtExists)) {
        // so we store jwt in chrome storage
        await chrome.storage.local.set({ jwt })
        // NOTE: let's assume that no1 will ever change their JWT and that if it exists, it's VALID
      }
    }
  }
})()

export {}
