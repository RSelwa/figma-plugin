import z from "zod"
import { FIGMA_MESSAGES } from "@/constants/messages"

const TypeEnum = z.enum(FIGMA_MESSAGES)

const createRectangleSchema = z.object({
  type: z.literal(FIGMA_MESSAGES.CREATE_RECTANGLES),
  count: z.number().min(1).max(100)
})

const setItemSchema = z.object({
  type: z.literal(FIGMA_MESSAGES.SET_ITEM),
  itemKey: z.string(),
  item: z.any()
})
const getItemSchema = z.object({
  type: z.literal(FIGMA_MESSAGES.GET_ITEM),
  itemKey: z.string()
})
const deleteItemSchema = z.object({
  type: z.literal(FIGMA_MESSAGES.DELETE_ITEM),
  itemKey: z.string()
})

const messageSchema = z.discriminatedUnion("type", [
  createRectangleSchema,
  setItemSchema,
  getItemSchema,
  deleteItemSchema
])

export type Message = z.infer<typeof messageSchema>
