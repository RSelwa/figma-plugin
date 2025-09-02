import { FIGMA_MESSAGES } from "@/constants/messages"

figma.showUI(__html__)

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-rectangles") {
    const nodes = []

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle()
      rect.x = i * 150
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }

    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: "create-rectangles",
      message: `Created ${msg.count} Rectangles`
    })
  }

  if (msg.type === FIGMA_MESSAGES.SET_ITEM) {
    console.log("msg.item", msg.item)

    await figma.clientStorage.setAsync(msg.itemKey, msg.item)

    const storage = await figma.clientStorage.getAsync(msg.itemKey)

    console.log("storageDDD", storage)
    return
  }
  if (msg.type === FIGMA_MESSAGES.GET_ITEM) {
    const storage = await figma.clientStorage.getAsync(msg.itemKey)

    // renvoyer à l'UI
    figma.ui.postMessage({
      type: msg.itemKey,
      data: storage
    })

    return
  }
  if (msg.type === FIGMA_MESSAGES.DELETE_ITEM) {
    console.log("DELETE_ITEM", msg.itemKey)

    await figma.clientStorage.deleteAsync(msg.itemKey)
    return
  }

  figma.closePlugin()
}
