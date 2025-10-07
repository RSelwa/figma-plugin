import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import {
  connectFirestoreEmulator,
  initializeFirestore
} from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { connectStorageEmulator, getStorage } from "firebase/storage"

// All process.env.* will be replaced at build time by dotenv-webpack
const IS_TEST =
  typeof process.env.NEXT_PUBLIC_APP_ENV !== "undefined"
    ? process.env.NEXT_PUBLIC_APP_ENV === "test"
    : false

const apiKey =
  typeof process.env.NEXT_PUBLIC_FBASE_API_KEY !== "undefined"
    ? process.env.NEXT_PUBLIC_FBASE_API_KEY
    : ""
const projectId =
  typeof process.env.NEXT_PUBLIC_FBASE_PROJECT_ID !== "undefined"
    ? process.env.NEXT_PUBLIC_FBASE_PROJECT_ID
    : ""
const messagingSenderId =
  typeof process.env.NEXT_PUBLIC_FBASE_MESSAGING_SENDER_ID !== "undefined"
    ? process.env.NEXT_PUBLIC_FBASE_MESSAGING_SENDER_ID
    : ""
const appId =
  typeof process.env.NEXT_PUBLIC_FBASE_APP_ID !== "undefined"
    ? process.env.NEXT_PUBLIC_FBASE_APP_ID
    : ""
const measurementId =
  typeof process.env.NEXT_PUBLIC_FBASE_MEASUREMENT_ID !== "undefined"
    ? process.env.NEXT_PUBLIC_FBASE_MEASUREMENT_ID
    : ""
export const isProd = projectId === "flim-prod"

const getDbId = () => {
  let databaseId =
    typeof process.env.TEST_WORKER_INDEX !== "undefined"
      ? process.env.TEST_WORKER_INDEX
      : undefined
  try {
    databaseId = localStorage.getItem("databaseId") || databaseId
  } catch (error) {}
  return databaseId
}

export const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
  appId,
  measurementId
}
export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
export const SITEMAP_BASE_URL =
  projectId === "flim-prod"
    ? "https://app.flim.ai"
    : typeof process.env.NODE_ENV !== "undefined" &&
      process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000"
    : "https://dev.flim.ai"

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const functions = getFunctions(app, "europe-west3")
export const storage = getStorage(app)
export const db = initializeFirestore(
  app,
  { ignoreUndefinedProperties: true },
  IS_TEST ? getDbId() : undefined
)

if (IS_TEST) {
  console.info(
    `%cEmulator: [STARTED], DB [${getDbId()}]`,
    "color: red; font-weight: bold;"
  )
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
  connectStorageEmulator(storage, "127.0.0.1", 9199)
}

if (
  typeof process.env.NEXT_PUBLIC_LOCAL_CLOUD_FUNCTIONS !== "undefined" &&
  process.env.NEXT_PUBLIC_LOCAL_CLOUD_FUNCTIONS === "true"
) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001)
}

export const TABLES = {
  USERS: "usersv2",
  INVITATIONS: "invitations",
  ORGANIZATIONS: "organisations",
  GEN_AI: "user_genai",
  BOARDS: "user_boards",
  SAVED: "board_saved_images",
  BOARD_IMAGES: "user_boards/board_images",
  BOARD_LIKES: "user_boards/board_likes",
  BOARD_VIEWS: "user_boards/board_views",
  BOARD_ORDERS: "user_boards/board_orders",
  BOARD_MODELS: "user_boards/board_models",
  STYLE_TRANSFER: "user_genai",
  PREFERENCES: "usersv2/preferences",
  TAGS: "usersv2/tags"
} as const

export const AUTH_VERIFY_URL = "http://localhost:3002"

// export const TABLE_REFS = {
//   [TABLES.USERS]: collection(db, TABLES.USERS) as CustomCollectionRef<typeof TABLES.USERS>,
//   [TABLES.INVITATIONS]: collection(db, TABLES.INVITATIONS) as CustomCollectionRef<typeof TABLES.INVITATIONS>,
//   [TABLES.ORGANIZATIONS]: collection(db, TABLES.ORGANIZATIONS) as CustomCollectionRef<typeof TABLES.ORGANIZATIONS>,
//   [TABLES.GEN_AI]: collection(db, TABLES.GEN_AI) as CustomCollectionRef<typeof TABLES.GEN_AI>,
//   [TABLES.BOARDS]: collection(db, TABLES.BOARDS) as CustomCollectionRef<typeof TABLES.BOARDS>,
//   [TABLES.SAVED]: collection(db, TABLES.SAVED) as CustomCollectionRef<typeof TABLES.SAVED>,
// } as const;

// export const TABLE_SUB_REFS = {
//   [TABLES.BOARD_IMAGES]: (id: string) =>
//     collection(db, `${TABLES.BOARDS}/${id}/board_images`) as CustomCollectionRef<typeof TABLES.BOARD_IMAGES>,
//   [TABLES.PREFERENCES]: (id: string) =>
//     collection(db, `${TABLES.USERS}/${id}/preferences`) as CustomCollectionRef<typeof TABLES.PREFERENCES>,
//   [TABLES.BOARD_ORDERS]: (id: string) =>
//     collection(db, `${TABLES.BOARDS}/${id}/board_orders`) as CustomCollectionRef<typeof TABLES.BOARD_ORDERS>,
//   [TABLES.BOARD_LIKES]: (id: string) =>
//     collection(db, `${TABLES.BOARDS}/${id}/board_likes`) as CustomCollectionRef<typeof TABLES.BOARD_LIKES>,
//   [TABLES.BOARD_VIEWS]: (id: string) =>
//     collection(db, `${TABLES.BOARDS}/${id}/board_views`) as CustomCollectionRef<typeof TABLES.BOARD_VIEWS>,
//   [TABLES.TAGS]: (id: string) =>
//     collection(db, `${TABLES.USERS}/${id}/tags`) as CustomCollectionRef<typeof TABLES.TAGS>,
//   [TABLES.BOARD_MODELS]: (id: string) =>
//     collection(db, `${TABLES.BOARDS}/${id}/board_models`) as CustomCollectionRef<typeof TABLES.BOARD_MODELS>,
// } as const;

// export const API_TABLES = {
//   userApi: TABLES.USERS,
//   boardApi: TABLES.BOARDS,
//   savedImagesApi: TABLES.SAVED,
//   boardImagesApi: TABLES.BOARD_IMAGES,
//   genAiApi: TABLES.GEN_AI,
// } as const;
