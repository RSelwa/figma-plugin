import React from "react"
import { useAuth } from "@/app/context/auth-context"
import { useBoards } from "@/app/hooks/boards"

const Boards = () => {
  const { user } = useAuth()

  useBoards(user)

  return <div>Boards</div>
}

export default Boards
