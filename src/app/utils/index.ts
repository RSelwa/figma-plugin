import { FIGMA_MESSAGES } from "@/constants/messages"

export const stockItemInStorage = async (itemKey: string, item: any) => {
  await parent.postMessage(
    {
      pluginMessage: {
        type: FIGMA_MESSAGES.SET_ITEM,
        item,
        itemKey
      }
    },
    "*"
  )
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

    parent.postMessage(
      { pluginMessage: { type: FIGMA_MESSAGES.GET_ITEM, itemKey } },
      "*"
    )
  })
}

export const clearItemFromStorage = async (itemKey: string) => {
  await parent.postMessage(
    {
      pluginMessage: {
        type: FIGMA_MESSAGES.DELETE_ITEM,
        itemKey
      }
    },
    "*"
  )
}
