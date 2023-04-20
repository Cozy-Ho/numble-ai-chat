import { Button, Typography } from "@/components/Common";
import DB, { Chat } from "@/utils/DB";
import { useState } from "react";

const Test = () => {
  const [apiResult, setApiResult] = useState<string>("");
  const handleClick = async () => {
    setApiResult("Loading...");
    const key = sessionStorage.getItem("apiKey") || null;
    if (!key) return;

    const _result = await fetch("/api/testChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: key,
      }),
    });
    const _data = await _result.json();
    if (_data.error) {
      setApiResult(_data.error.message);
      return;
    }
    setApiResult(_data.result.content);
  };

  const handleClickTest2 = async () => {
    //
    const db = new DB();
    await db.open();
    const _result = await db.getChatList(
      "60a803e3-1f4d-45a7-a085-5cde5b98e48a",
    );

    if (_result.result) {
      console.log("success", _result.data);
      let totalTokents = 0;
      _result.data.forEach((chat: Chat) => {
        totalTokents += chat.message.split("").length / 2;
      });
      setApiResult(totalTokents.toString());
    } else {
      console.log("fail", _result.message);
      setApiResult(_result.message || "fail");
    }
  };

  return (
    <div>
      <h1>Test</h1>
      <Button onClick={handleClick}>{"test"}</Button>
      <Button onClick={handleClickTest2}>{"Calc token"}</Button>
      <Typography fontSize={16}>{apiResult}</Typography>
    </div>
  );
};
export default Test;
