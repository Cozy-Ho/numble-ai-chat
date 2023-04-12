import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = {
  result?: string;
  error?: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  //
  const key = req.body.apiKey;

  try {
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: key,
      }),
    );
    openai
      .listModels()
      .then(data => {
        res.status(200).json({
          result: "success",
        });
      })
      .catch(e => {
        res.status(200).json({
          error: {
            message: `API failed`,
          },
        });
      });
  } catch (e) {
    res.status(200).json({
      error: {
        message: `API Key error`,
      },
    });
  }
}
