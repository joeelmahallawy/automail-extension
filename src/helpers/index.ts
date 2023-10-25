import createCache from "@emotion/cache"
import type { EmotionCache } from "@emotion/react"

export const getEnvironmentServerURL = () =>
  process.env.NODE_ENV === "development"
    ? `https://automail-backend-production.up.railway.app`
    : // ? `http://localhost:4000`
      `https://automail-backend-production.up.railway.app`

export async function getCurrentTab() {
  let queryOptions = { active: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)

  return tab.id
}

export const getEnvironmentWebsiteURL = () =>
  process.env.NODE_ENV === "production"
    ? `http://localhost:3000`
    : `http://localhost:3000`

export const createNewStyleTag = (element: HTMLStyleElement) =>
  createCache({
    key: "mantine",
    prepend: true,
    container: element
  })

export const getActiveTabURL = async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true
  })

  return tabs[0]
}

export const getCookie = (cookieName) => {
  let name = cookieName + "="
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ""
}

export const openNewTab = ({ url }: { url: string }) => {
  chrome.tabs.create({
    url,
    active: true
  })
}

export const getMessageIdFromEmailPage = (doc: Document) =>
  doc.querySelector("[data-message-id]").getAttribute("data-legacy-message-id")

export const getThreadIdFromEmailPage = (doc: Document) =>
  document
    .querySelector(`h2[data-legacy-thread-id]`)
    .getAttribute("data-legacy-thread-id")

export const randomHash = (): string => {
  return (Math.random() + 1).toString(24).substring(2)
}

export const getStyleTagByID = (id: string) => {
  let styleTag

  const plasmoContainer = document.querySelector("plasmo-csui")

  if (
    id == plasmoContainer.shadowRoot.querySelector("style").getAttribute("id")
  ) {
    styleTag = plasmoContainer.shadowRoot.querySelector("style")
  }

  console.log(`final styleTag:`, styleTag)

  return styleTag
}

export const getUnusedStyleCache = (
  dynamicStyleTagsIDs: string[],
  usedTags: object
): EmotionCache => {
  let styleCache: EmotionCache
  let continueLoop = true
  let i = 0

  while (continueLoop) {
    // has current id been used?
    if (!usedTags[dynamicStyleTagsIDs[i]]) {
      // create cache with the current style tag as the container
      styleCache = createCache({
        key: "mantine",
        prepend: true,
        container: getStyleTagByID(dynamicStyleTagsIDs[i])
      })

      usedTags[dynamicStyleTagsIDs[i]] = true
      continueLoop = false
    }
    // if we have no more unused ids, end loop
    if (Object.keys(usedTags).length === dynamicStyleTagsIDs.length) {
      continueLoop = false
    }
    i = i + 1
  }

  return styleCache
}
