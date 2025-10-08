import React from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/constants/db"
import { useAuth } from "@/app/context/auth-context"

export const Login = () => {
  const { error } = useAuth()
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get("email")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    try {
      console.log("Logging in with", email, password)

      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  // ;<form
  //   className="relative m-auto flex w-full max-w-[560px] flex-col gap-6"
  //   onSubmit={handleSubmit(onSubmit)}
  // >
  //   {hasError && (
  //     <div className="-my-4 text-center text-sm text-palette-primary-500">
  //       {error?.message}
  //     </div>
  //   )}
  //   <LegacyInput
  //     autoFocus
  //     type="email"
  //     label="Email"
  //     id="email"
  //     {...register("email")}
  //   />

  //   <LegacyInput
  //     type="password"
  //     label="Password"
  //     id="password"
  //     {...register("password")}
  //   >
  //     <Link
  //       href="/fpassword"
  //       className="mt-2 self-end text-base leading-none font-light text-primary-500"
  //     >
  //       Forgot your password?
  //     </Link>
  //   </LegacyInput>
  //   <Button
  //     className="text-lg"
  //     status={isSubmitting ? STATUS.LOADING : STATUS.IDLE}
  //     type="submit"
  //   >
  //     Login
  //   </Button>
  // </form>

  return (
    <form
      onSubmit={handleLogin}
      className="relative m-auto flex w-full max-w-[560px] flex-col gap-6"
    >
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="relative flex w-full flex-col items-start gap-3">
        <label htmlFor="email">
          <span>Email</span>
        </label>
        <input
          className="max-h-full w-full min-w-0 rounded border border-gray-50 bg-gray-50 p-3 text-[16px] leading-none text-gray-black focus:border-gray-50 focus:bg-transparent dark:border-gray-200 dark:focus:bg-gray-100 [[data-state=error]_&]:border-primary-500 [[data-state=error]_&]:text-primary-500"
          autoFocus
          placeholder="email"
          type="email"
          name="email"
          id="email"
        />
      </div>
      <div className="relative flex w-full flex-col items-start gap-3">
        <label htmlFor="password">
          <span>Password</span>
        </label>
        <input
          className="max-h-full w-full min-w-0 rounded border border-gray-50 bg-gray-50 p-3 text-[16px] leading-none text-gray-black focus:border-gray-50 focus:bg-transparent dark:border-gray-200 dark:focus:bg-gray-100 [[data-state=error]_&]:border-primary-500 [[data-state=error]_&]:text-primary-500"
          placeholder="password"
          type="password"
          name="password"
          id="password"
        />
      </div>

      <button
        id="login"
        type="submit"
        className="inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors duration-150 focus:outline-none disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 text-lg border border-primary-500 bg-primary-500 text-white hover:border-primary-600 hover:bg-primary-600 dark:border-primary-500"
      >
        Login
      </button>
    </form>
  )
}

export const Logout = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <button id="logout" onClick={handleLogout}>
      Logout
    </button>
  )
}
