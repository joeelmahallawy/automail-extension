import { getEnvironmentWebsiteURL, openNewTab } from "~helpers"

// NOTE: Things run here once
export {}

// force user to signup when first registering
chrome.runtime.onInstalled.addListener(function () {
  openNewTab({ url: `${getEnvironmentWebsiteURL()}/login` })
  return false
})
