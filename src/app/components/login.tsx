import React from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { TOKEN_KEY } from "@/constants"
import { auth } from "@/constants/db"

export const Login = () => {
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get("email")
    const password = formData.get("password")
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      )
      console.log("Logged in user:", credentials.user)

      const token = await credentials.user.getIdToken()
      console.log("User token to store:", token)

      window.localStorage.setItem(TOKEN_KEY, token)
      // parent.postMessage({ pluginMessage: { type: 'set-token', token } }, '*');
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" name="email" id="email" />
      <input type="password" name="password" id="password" />
      <button id="login" type="submit">
        Login
      </button>
    </form>
  )
}
