import React from "react"
import { createRoot } from "react-dom/client"
import { AuthProvider } from "@/app/context/auth-context"
import App from "./components/App"

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("react-page")
  const root = createRoot(container)
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
})
