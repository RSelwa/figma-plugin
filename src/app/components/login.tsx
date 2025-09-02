import React from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/constants/db"
import { useAuth } from "@/app/context/auth-context"

export const Login = () => {
  const { error } = useAuth()
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get("email").toString()
    const password = formData.get("password").toString()

    try {
      console.log("Logging in with", email, password)

      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="email" type="email" name="email" id="email" />
      <input
        placeholder="password"
        type="password"
        name="password"
        id="password"
      />
      <button id="login" type="submit">
        Login
      </button>
    </form>
  )
}
