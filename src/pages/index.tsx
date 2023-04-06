import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("");

  const handleFetchApi = () => {
    setResult("loading...");
    fetch("/api/test")
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
    <>
      <div>hello next.js</div>
      <button
        onClick={handleFetchApi}
        style={{
          width: 100,
          height: 32
        }}
      >
        Test
      </button>
      <div>{`result : ${result}`}</div>
    </>
  );
}
