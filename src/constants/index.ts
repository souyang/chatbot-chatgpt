import { ChatCompletionRequestMessage } from "openai"

export const ROLE_TPYE = {
    ASSISTANT: 'assistant',
    USER: 'user'
}

export const CHATBOT_NAME = 'WALL-E'
export const USER_NAME = "User"

export const INITIAL_CONVERSATION: ChatCompletionRequestMessage[] = [
    {"role": "system", "content": `You are a helpful assistant named ${CHATBOT_NAME}.`}
]