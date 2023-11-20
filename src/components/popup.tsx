import {
  Accordion,
  Anchor,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Loader,
  Menu,
  Modal,
  Text,
  Title,
  Tooltip
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import {
  IconArrowRight,
  IconChevronRight,
  IconLogicAnd,
  IconMessageCircle,
  IconPlus,
  IconSettings,
  IconSwitchHorizontal
} from "@tabler/icons-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useAsyncFn } from "react-use"

import { sendToBackground } from "@plasmohq/messaging"

import { getEnvironmentWebsiteURL, openNewTab } from "~helpers"
import type { User } from "~interfaces"

import logo from "../../assets/logo-light.png"

export function Main() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmailIdToDelete, setCurrentEmailIdToDelete] = useState(null)
  // @ts-expect-error
  const [state, doFetch]: [
    state: { loading: boolean; value: User | null; error: any },
    doFetch: any
  ] = useAsyncFn(async () => {
    const session = await sendToBackground({
      name: "session",
      body: { withEmails: true }
    })
    return session
  }, [])

  useEffect(() => {
    doFetch()
  }, [])

  if (state.loading) {
    return (
      <Center
        style={{
          flexDirection: "column",
          padding: 16,
          width: 300
        }}>
        <Loader size="xl" color="black" />{" "}
      </Center>
    )
  }

  // user is NOT logged in
  return !state.value ? (
    <Box style={{ padding: 5 }}>
      <Center sx={{ justifyContent: "flex-end", gap: 5 }}>
        <Title order={5}>Automail</Title>
        <Image src={logo.src} width={30} />
      </Center>
      <Center
        style={{
          flexDirection: "column",
          padding: 5,
          width: 300
        }}>
        <Title order={3}>Welcome to Automail</Title>
        <Button
          onClick={() => {
            openNewTab({
              url: `${getEnvironmentWebsiteURL()}/api/oauth/google`
            })
          }}
          mt={5}
          fullWidth>
          Log in to continue
        </Button>
      </Center>
    </Box>
  ) : (
    <Box>
      <Center sx={{ justifyContent: "space-between", padding: 5 }}>
        <Center sx={{ gap: 5 }}>
          <Title order={5}>Automail</Title>
          <Image src={logo.src} width={30} />
        </Center>
        <Menu withArrow shadow="md" width={140} position="left">
          <Menu.Target>
            <Tooltip position="bottom" label={`${state.value?.email}`}>
              <Avatar
                sx={{ "&:hover": { cursor: "pointer" } }}
                size={30}
                radius="xl"
                src={state.value?.profilePicture}
              />
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                openNewTab({
                  url: `${getEnvironmentWebsiteURL()}/api/oauth/google`
                })
              }}
              icon={<IconSwitchHorizontal size={16} />}>
              <Text size="xs">Switch account</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>
      <Divider />
      <Box
        style={{
          flexDirection: "column",
          padding: "8px 4px",
          // padding: "4px 16px",
          width: 350
        }}>
        <Title order={6}> Scheduled emails:</Title>
        <Accordion
          mt={5}
          chevron={<IconChevronRight size="1rem" />}
          styles={{
            chevron: {
              "&[data-rotate]": {
                transform: "rotate(90deg)"
              }
            },
            // item: {
            //   "&[data-active]": {
            //     // backgroundColor: "red"
            //     backgroundColor: "#EFF2F5"
            //   }
            // },
            control: {
              "&[data-active]": {
                backgroundColor: "#EFF2F5"
              }
            }
          }}>
          <Modal
            withCloseButton={false}
            size="auto"
            centered
            onClose={() => {
              setCurrentEmailIdToDelete(null)
            }}
            opened={!!currentEmailIdToDelete}>
            <Text>Are you sure you want to cancel this email?</Text>
            <Center mt={5} sx={{ gap: 3 }}>
              <Button
                onClick={() => {
                  setCurrentEmailIdToDelete(null)
                }}
                variant="outline"
                color="gray"
                fullWidth
                size="xs">
                Cancel
              </Button>
              <Button
                loading={isLoading}
                onClick={async () => {
                  setIsLoading(true)
                  const cancelFollowUpEmail = await sendToBackground({
                    name: "cancelFollowUpEmail",
                    body: { id: currentEmailIdToDelete }
                  })
                  setIsLoading(false)
                  setCurrentEmailIdToDelete(null)
                  doFetch()
                }}
                color="red"
                fullWidth
                size="xs">
                Confirm
              </Button>
            </Center>
          </Modal>
          {state?.value?.ScheduledEmails?.length === 0 && (
            <Text>No follow up emails have been scheduled yet</Text>
          )}
          {state?.value?.ScheduledEmails?.map((email, i) => (
            <Accordion.Item key={i} value={email.id}>
              <Accordion.Control
                sx={(t) => ({ "&:hover": { background: t.colors.gray[1] } })}>
                <Text size="xs">
                  Email to {email.recipients[0]?.split(" <")[0]}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <strong>Email: </strong>
                {email.body}

                <Divider my={3} />
                <Box>
                  <strong>Scheduled time: </strong>
                  {moment(email.sendAt).format("MMMM Do YYYY, h:mm a")}
                </Box>

                <Button
                  onClick={async () => {
                    setCurrentEmailIdToDelete(email.id)
                  }}
                  fullWidth
                  mt={5}
                  size="xs"
                  color="red">
                  Cancel email
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
            // <Box
            //   mt={5}
            //   sx={(t) => ({
            //     padding: 10,
            //     background: t.colors.gray[2],
            //     border: "0.5px solid lightgray",
            //     borderRadius: 5,
            //     "&:hover": {
            //       background: t.colors.gray[3],
            //       cursor: "pointer"
            //     }
            //   })}>
            //   Email to {email.recipients[0]?.split(" <")[0]}
            //   {moment(email.sendAt).format("MMMM Do YYYY, h:mm a")}
            // </Box>
          ))}
        </Accordion>
        {/* <Title order={3}>Check scheduled emails</Title> */}
      </Box>
    </Box>
  )
}
