import { FIGMA_MESSAGES } from "@/constants/messages"
import { Message } from "../../schemas"

figma.showUI(__html__, {
  width: 500,
  height: 700
})

figma.ui.onmessage = async (msg: Message) => {
  if (msg.type === FIGMA_MESSAGES.CREATE_RECTANGLES) {
    const nodes: RectangleNode[] = []

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

  if (msg.type === FIGMA_MESSAGES.CREATE_IMAGE) {
    const nodes: RectangleNode[] = []
    const authorizedSelectionTypes = [
      "RECTANGLE",
      "ELLIPSE",
      "POLYGON",
      "STAR",
      "VECTOR",
      "PAGE",
      "FRAME"
    ]

    const image = await figma.createImageAsync(msg.url)
    const { width, height } = await image.getSizeAsync()
    const firstSelection = figma.currentPage.selection[0]
    const isSometingSelected =
      figma.currentPage.selection.length > 0 &&
      authorizedSelectionTypes.includes(firstSelection.type)

    if (isSometingSelected) {
      // @ts-ignore fix this later
      firstSelection.fills = [
        { type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }
      ]
      // @ts-ignore fix this later
      nodes.push(firstSelection)
    } else {
      const rect = figma.createRectangle()
      rect.resize(width, height)

      rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }]

      figma.currentPage.appendChild(rect)
      nodes.push(rect)

      figma.currentPage.selection = nodes
      figma.viewport.scrollAndZoomIntoView(nodes)
    }
    if (msg.closePlugin) figma.closePlugin()

    return
  }

  if (msg.type === FIGMA_MESSAGES.SET_ITEM) {
    await figma.clientStorage.setAsync(msg.itemKey, msg.item)

    await figma.clientStorage.getAsync(msg.itemKey)

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
    await figma.clientStorage.deleteAsync(msg.itemKey)
    return
  }

  figma.closePlugin()
}
