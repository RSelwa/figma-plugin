import { FIGMA_MESSAGES } from "@/constants/messages"
import { Message } from "../../../schemas"

export const postMessageToPlugin = (message: Message) => {
  parent.postMessage({ pluginMessage: message }, "*")
}

export const stockItemInStorage = async (itemKey: string, item: any) => {
  await postMessageToPlugin({
    type: FIGMA_MESSAGES.SET_ITEM,
    item,
    itemKey
  })
}

export const retrieveItemFromStorage = async <T = any>(
  itemKey: string
): Promise<T | null> => {
  return new Promise<T | null>((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage

      if (msg?.type === itemKey) {
        window.removeEventListener("message", handleMessage)
        resolve(msg.data as T)
      }
    }

    window.addEventListener("message", handleMessage)

    postMessageToPlugin({ type: FIGMA_MESSAGES.GET_ITEM, itemKey })
  })
}

export const clearItemFromStorage = async (itemKey: string) => {
  await postMessageToPlugin({
    type: FIGMA_MESSAGES.DELETE_ITEM,
    itemKey
  })
}
