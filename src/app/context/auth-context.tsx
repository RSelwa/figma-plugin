import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signInWithCustomToken, User } from "firebase/auth"
import { auth, AUTH_VERIFY_URL } from "@/constants/db"
import {
  clearItemFromStorage,
  retrieveItemFromStorage,
  stockItemInStorage
} from "@/app/utils"

export type Context = {
  user: User | null
  isLoading: boolean
  error?: string | null
}

const AuthContext = createContext<Context>({
  user: null,
  isLoading: true
})

export const itemKey = "token"

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  const init = async () => {
    try {
      setIsLoading(true)
      setError("")
      const token = await retrieveItemFromStorage<string>(itemKey)

      const headers = { Authorization: `Bearer ${token}` }
      const res = await fetch(AUTH_VERIFY_URL, {
        method: "POST",
        headers
      })

      const customToken = await res.json()

      if (!res.ok || customToken.code === "auth/id-token-expired") {
        setError("Your session has expired, please login again")
        // await clearItemFromStorage(itemKey)
        setIsLoading(false)
      }

      await signInWithCustomToken(auth, customToken.token)
    } catch (error) {
      console.error("Error during auth initialization", error)
    }
    setIsLoading(false)
    // 2️⃣ écouter les changements d’auth Firebase
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)

      if (u) {
        const token = await u.getIdToken()
        await stockItemInStorage(itemKey, token)

        return
      }

      await clearItemFromStorage(itemKey)
    })

    // nettoyer l’abonnement au retour du useEffect
    return unsubscribe
  }

  useEffect(() => {
    init()
  }, [])

  const value = { user, isLoading, error }

  return <AuthContext.Provider {...{ value }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
