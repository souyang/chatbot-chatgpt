import type { NextApiRequest, NextApiResponse } from "next"
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"
import { config } from "dotenv"
config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_KEY
});
const openai = new OpenAIApi(configuration);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const messages: ChatCompletionRequestMessage[] = req.body.message
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages
    });
    res.status(200).json({ result: completion.data.choices[0].message?.content })
}