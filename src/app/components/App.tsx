import { Login, Logout } from "@/app/components/login"
import { useAuth } from "@/app/context/auth-context"
import "@/app/style/style.css"
import React, { useEffect, useState } from "react"
import { AUTH_VERIFY_URL, baseUrl } from "@/constants/db"
import { ImageType } from "@/constants/images"
import { FIGMA_MESSAGES } from "@/constants/messages"
import { postMessageToPlugin } from "@/app/utils"

function App() {
  const { user, isLoading } = useAuth()
  const [images, setImages] = useState<ImageType[]>([])
  const [closePlugin, setClosePlugin] = useState(false)
  const [search, setSearch] = useState("")
  // const textbox = useRef<HTMLInputElement>(undefined)

  // const countRef = useCallback((element: HTMLInputElement) => {
  //   if (element) element.value = "5"
  //   textbox.current = element
  // }, [])

  const fetchDirectBack = async () => {
    try {
      console.log("Fetching direct back")
      const token = await user?.getIdToken()

      const body = {
        search: {
          saved_images: false,
          full_text: search,
          similar_picture_id: "",
          movie_id: "",
          dop: "",
          director: "",
          brand: "",
          agency: "",
          production_company: "",
          actor: "",
          creator: "",
          artist: "",
          collection_id: "",
          board_id: "",
          filters: {
            genres: [],
            colors: [],
            number_of_persons: [],
            years: [],
            shot_types: [],
            movie_types: [],
            aspect_ratio: [],
            safety_content: [],
            has_video_cuts: false,
            camera_motions: []
          },
          negative_filters: {
            aspect_ratio: [],
            genres: ["ANIMATION"],
            movie_types: [],
            colors: [],
            shot_types: [],
            number_of_persons: [],
            years: [],
            safety_content: ["nudity", "violence"]
          }
        },
        page: 0,
        sort_by: "",
        order_by: "",
        number_per_pages: 100
      }

      const response = await fetch(baseUrl + "/search", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json"
        }
      })

      const data = await response.json()

      if (data?.query_response?.images) setImages(data.query_response.images)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchImages = async () => {
    try {
      const token = await user?.getIdToken()

      const response = await fetch(AUTH_VERIFY_URL + `/search?sq=${search}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json"
        }
      })

      const data = await response.json()

      if (data?.query_response?.images) setImages(data.query_response.images)
    } catch (error) {
      console.error(error)
    }
  }

  // const onCreate = () => {
  //   const count = parseInt(textbox.current?.value || "", 10)
  //   parent.postMessage(
  //     { pluginMessage: { type: "create-rectangles", count } },
  //     "*"
  //   )
  // }

  const createImage = async (url: string) => {
    await postMessageToPlugin({
      type: FIGMA_MESSAGES.CREATE_IMAGE,
      url,
      closePlugin
    })
  }

  // const onCancel = () => {
  //   //   postMessageToPlugin({ type: "cancel" })
  // }

  useEffect(() => {
    fetchDirectBack()
    fetchImages()
  }, [user])

  useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`)
      }
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <main className="p-4">
      <section className="flex gap-4 items-center">
        <Logout />
        <span>
          Close plugin after image insertion?
          <label htmlFor="close-plugin"></label>
          <input
            type="checkbox"
            onChange={() => setClosePlugin(!closePlugin)}
            id="close-plugin"
            name="close-plugin"
          />
        </span>
      </section>

      <section>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            fetchImages()
            fetchDirectBack()
          }}
        >
          <input
            type="search"
            name="search"
            onChange={(e) => setSearch(e.currentTarget.value)}
            id=""
          />
          <button type="submit">Search</button>
        </form>
        <div className="grid grid-cols-2">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.medium_resolution_url}
              onClick={() => createImage(img.medium_resolution_url)}
              alt="mock"
              className=""
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
