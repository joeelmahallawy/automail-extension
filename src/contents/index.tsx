import { Box, Button, Modal, Text, Textarea, Title } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconArrowBack } from "@tabler/icons-react"
import moment from "moment"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetStyle
} from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackgroundViaRelay } from "@plasmohq/messaging"

import {
  getThreadIdFromEmailPage,
  getUnusedStyleCache,
  randomHash
} from "~helpers"
import type { User } from "~interfaces"
import { ThemeProvider } from "~theme"

export const config: PlasmoCSConfig = {
  matches: ["https://mail.google.com/*"],
  all_frames: true,
  world: "MAIN"
}

const dynamicStyleTagsIDs = []
const usedStyleTagIDs = {}

export const getStyle: PlasmoGetStyle = (props) => {
  const newStyleElement = document.createElement(`style`)

  const id = randomHash()
  newStyleElement.id = id
  dynamicStyleTagsIDs.push(id)

  return newStyleElement
}

// the email that's being hovered will have class .aqw
export const getInlineAnchorList: PlasmoGetInlineAnchorList = () =>
  document.querySelectorAll(`.amn span:last-child`)

const GmailFollowupBox = () => {
  const [followUpEmailModalOpen, setFollowUpEmailModalOpen] = useState(false)
  const [session, setSession] = useState<User | null>(null)
  const [emailThreadId, setEmailThreadId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const user: User = await sendToBackgroundViaRelay({
        name: "session"
      })

      setSession(user)
    })()

    setEmailThreadId(getThreadIdFromEmailPage(document))

    // set zIndex to not show in modal
    document
      .querySelector("plasmo-csui")
      .shadowRoot.getElementById("plasmo-shadow-container").style.zIndex = "0"
  }, [])

  const form = useForm({
    initialValues: {
      emailContent: "",
      followUpDate: undefined
    },
    validate: {
      followUpDate: (val) => (!val ? `Invalid date` : null)
    }
  })

  return (
    session && (
      <ThemeProvider
        emotionCache={getUnusedStyleCache(
          dynamicStyleTagsIDs,
          usedStyleTagIDs
        )}>
        <Box>
          <Modal
            size="lg"
            withCloseButton={false}
            sx={{ position: "relative" }}
            onClose={() => setFollowUpEmailModalOpen(false)}
            title={<Text>Schedule a follow-up email</Text>}
            opened={followUpEmailModalOpen}>
            <form
              onSubmit={form.onSubmit(
                async ({ emailContent, followUpDate }) => {
                  setIsLoading(true)
                  const sendEmail = await sendToBackgroundViaRelay({
                    name: "scheduleFollowUpEmail",
                    body: {
                      email: emailContent,
                      threadId: emailThreadId,
                      sendAt: followUpDate
                    }
                  })
                  setIsLoading(false)

                  if (sendEmail.success) {
                    setFollowUpEmailModalOpen(false)
                    return notifications.show({
                      message: `Scheduled email for ${moment(
                        followUpDate
                      ).format("MMM Do YYYY, h:mm a")}`,
                      // message: "Hey there, your code is awesome! 🤥",
                      color: "green"
                    })
                  }
                  return notifications.show({
                    message: `Error occurred: ${sendEmail.error}`,
                    color: "red"
                  })
                }
              )}>
              <Textarea
                required
                {...form.getInputProps("emailContent")}
                autosize
                minRows={4}
                maxRows={10}
                sx={{ width: "100%" }}
                label="Your email"
                withAsterisk
              />

              <DateTimePicker
                // minDate={new Date(new Date().getTime() - 1000 * 60 * 60 * 24)}
                minDate={new Date()}
                mt={5}
                dropdownType="modal"
                clearable
                size="sm"
                withAsterisk
                required
                {...form.getInputProps("followUpDate")}
                valueFormat="MMM DD, YYYY hh:mm A"
                label="Scheduled time to send if no response"
                placeholder="e.g. Oct 17, 2023 09:32 AM"
                mx="auto"
              />
              <Button
                disabled={
                  !form.values.emailContent || !form.values.followUpDate
                }
                loading={isLoading}
                type="submit"
                mt={7}
                fullWidth>
                Send follow up
              </Button>
            </form>
          </Modal>

          {/* show button if we sent the last email */}
          {document
            .querySelectorAll(".c2")
            [document.querySelectorAll(".c2").length - 1].querySelector(
              "span[email]"
            )
            .getAttribute("email")
            .replace("<", "")
            .replace(">", "") === session?.email && (
            <Button
              sx={{
                "&:hover": {
                  cursor:
                    document
                      .querySelectorAll(".c2")
                      [
                        document.querySelectorAll(".c2").length - 1
                      ].querySelector("span[email]")
                      .getAttribute("email")
                      .replace(">", "") !== session?.email
                      ? "not-allowed"
                      : "pointer"
                }
              }}
              onClick={() => {
                setFollowUpEmailModalOpen(true)
              }}
              leftIcon={<IconArrowBack strokeWidth={1.2} />}
              radius="xl"
              variant="outline">
              Follow up
            </Button>
          )}
        </Box>
      </ThemeProvider>
    )
  )
}

export default GmailFollowupBox
