import Boards from "@/app/components/boards"
import { Login } from "@/app/components/login"
import { itemKey, useAuth } from "@/app/context/auth-context"
import "@/app/style/style.css"
import React, { useCallback, useEffect, useRef } from "react"
import { AUTH_VERIFY_URL } from "@/constants/db"
import { FIGMA_MESSAGES } from "@/constants/messages"

function App() {
  const { user } = useAuth()
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
    <main>
      UID: {user?.uid}
      <button
        className="bg-black text-white "
        onClick={async () => {
          console.log("Clearing token from local storage UI")

          await parent.postMessage(
            {
              pluginMessage: {
                type: FIGMA_MESSAGES.DELETE_ITEM,
                itemKey
              }
            },
            "*"
          )
        }}
      >
        Clear Token local
      </button>
      <button
        className="bg-primary-500 text-white px-4 py-2 rounded mb-4"
        onClick={async () => {
          await fetch(AUTH_VERIFY_URL, { method: "POST" })
            .then((res) => res.text())
            .then((text) => console.log(text))
        }}
      >
        TEST LOCAL
      </button>
      {user ? (
        <div>
          <Boards />
          <h2 className="text-primary-500">Rectangle Creator</h2>
          <p>
            Count: <input ref={countRef} />
          </p>
          <button
            onClick={async () => {
              const token = window.localStorage.getItem("")
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
      ) : (
        <>
          <Login />
        </>
      )}
    </main>
  )
}

export default App
