import { Box, Button } from "@mantine/core"
import { useState } from "react"


export function Main({ name = "Extension" }) {
  const [data, setData] = useState("")

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 200
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> {name}!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />

      <Button>Log in</Button>
    </Box>
  )
}
