import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_CF_OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Who won the world series in 2020?",
          name: "user",
        },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
          name: "assistant1",
        },
        { role: "user", content: "Where was it played?" },
        {
          role: "assistant",
          content:
            "The 2020 World Series was played in a neutral site due to the COVID-19 pandemic. It was played at Globe Life Field in Arlington, Texas.",
          name: "assistant2",
        },
        {
          role: "assistant",
          content:
            "That's correct. Globe Life Field in Arlington, Texas, was chosen as the neutral site for the 2020 World Series due to the pandemic.",
          name: "assistant1",
        },
        {
          role: "assistant",
          content: "Is there anything else I can help you with?",
          name: "assistant2",
        },
      ],
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
