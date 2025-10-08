import React from "react"
import { useAuth } from "@/app/context/auth-context"
import { useBoards } from "@/app/hooks/boards"

const Boards = () => {
  const { user } = useAuth()

  if (!user) return <div>Please log in to view your boards.</div>
  useBoards(user)

  return <div>Boards</div>
}

export default Boards
