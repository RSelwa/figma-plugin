import { Login } from "@/app/components/login"
import "@/app/style.css"
import React, { useCallback, useEffect, useRef } from "react"
import { TOKEN_KEY } from "@/constants"

function App() {
  const textbox = useRef<HTMLInputElement>(undefined)

  const countRef = useCallback((element: HTMLInputElement) => {
    if (element) element.value = "5"
    textbox.current = element
  }, [])

  const onCreate = () => {
    const count = parseInt(textbox.current.value, 10)
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    )
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*")
  }

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`)
      }
    }
  }, [])

  return (
    <div>
      <h2 className="text-red-500">Rectangle Creator</h2>

      <Login />
      <p>
        Count: <input ref={countRef} />
      </p>
      <button
        onClick={async () => {
          const token = window.localStorage.getItem(TOKEN_KEY)
          console.log("Token from local storage:", token)
        }}
      >
        get token
      </button>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default App
