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
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center"
      }}
    >
      <div>hello next.js</div>
      <input
        type="text"
        value={inputText}
        multiple={true}
        onChange={e => setInputText(e.target.value)}
        style={{
          width: 300,
          height: 42,
          marginTop: 16
        }}
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
          marginTop: 16,
          width: 600
        }}
      >{`result : ${result}`}</div>
    </div>
  );
}
