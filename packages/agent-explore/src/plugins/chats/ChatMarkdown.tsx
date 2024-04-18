import { MarkDown } from "@veramo-community/agent-explorer-plugin"
import { ChatBubbleProps } from "./ChatBubble.js"

export const ChatMarkdown = ({ message }: ChatBubbleProps) => {
    // @ts-ignore
    const content = message && message.data && message.data.content || ''
    return <MarkDown content={content} />
}