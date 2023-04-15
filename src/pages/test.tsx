import { Button, Typography } from "@/components/Common";
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
  return (
    <div>
      <h1>Test</h1>
      <Button onClick={handleClick}>{"test"}</Button>
      <Typography fontSize={16}>{apiResult}</Typography>
    </div>
  );
};
export default Test;
