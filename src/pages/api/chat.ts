import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

type Data = {
  result?: {
    role: string;
    content: string;
  };
  error?: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.body.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const messageList: ChatCompletionRequestMessage[] = req.body.messages;
  if (!messageList) {
    res.status(500).json({
      error: {
        message: "No messages received",
      },
    });
    return;
  }

  try {
    const configuration = new Configuration({
      apiKey: req.body.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageList,
      max_tokens: 512,
    });
    console.log("# gpt says : ", completion.data);
    if (!completion.data.choices[0].message) {
      res.status(200).json({
        error: {
          message: "No response from OpenAI",
        },
      });
    }

    res.status(200).json({
      result: {
        role: completion.data.choices[0].message?.role || "",
        content: completion.data.choices[0].message?.content || "",
      },
    });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
