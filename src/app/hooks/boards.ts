import { User } from "firebase/auth"
import { baseUrl } from "@/constants/db"

export const useBoards = async (user: User) => {
  try {
    const token = await user.getIdToken()
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${token}`)

    const response = await fetch(`${baseUrl}/user/${user.uid}/boards`, {
      headers
    })

    console.log(response)
  } catch (error) {
    console.error("Error fetching boards:", error)
  }
}
