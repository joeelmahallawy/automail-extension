import type { EmotionCache, MantineProviderProps } from "@mantine/core"
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import type { PropsWithChildren } from "react"

interface Props extends PropsWithChildren<MantineProviderProps> {
  emotionCache?: EmotionCache
}

export function ThemeProvider({ emotionCache, children, ...props }: Props) {
  return (
    <MantineProvider emotionCache={emotionCache} {...props}>
      <Notifications position="top-center" />
      {children}
    </MantineProvider>
  )
}
