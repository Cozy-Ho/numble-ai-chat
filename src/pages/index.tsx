import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("");

  const [inputText, setInputText] = useState<string>("");

  const handleFetchApi = () => {
    setResult("loading...");
    fetch("/api/testPrompt", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: inputText
      })
    })
      .then(res => {
        res.json().then(data => {
          setResult(data.result);
        });
      })
      .catch(e => {
        console.log("# error : ", e.message);
        setResult(JSON.stringify(e));
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div>hello next.js</div>
      <input
        type="text"
        value={inputText}
        style={{
          width: 300,
          marginTop: 16
        }}
        onChange={e => setInputText(e.target.value)}
      />

      <button
        onClick={handleFetchApi}
        style={{
          marginTop: 16,
          width: 100,
          height: 32
        }}
      >
        Test
      </button>
      <div
        style={{
          marginTop: 16
        }}
      >{`result : ${result}`}</div>
    </div>
  );
}
