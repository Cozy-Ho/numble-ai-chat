import { useState } from "react";
import { Logo } from "@/components/Icons";
import {
  Button,
  Container,
  MainLayout,
  TextField,
  Typography,
} from "@/components/Common";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const [apiKey, setApiKey] = useState<string>("");
  const [error, setError] = useState<string | boolean>(false);

  const handleLogin = async () => {
    //
    setError(false);
    const _result = await fetch("/api/checkKey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: apiKey,
      }),
    });

    const _data = await _result.json();
    console.log("# check : ", _data);
    if (_data.result === "success") {
      console.log("success");
      // handleFetchApi();
      router.push("/lobby");
    } else {
      console.log("fail");
      setError("KEY가 올바르지 않습니다.");
    }
  };

  const handleClickHowtoGenerateKey = () => {
    window.open("https://platform.openai.com/account/api-keys");
  };

  return (
    <MainLayout>
      <Container
        fullHeight
        fullWidth
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Container
          padding={92}
          style={{
            marginTop: 64,
          }}
        >
          <Logo />
        </Container>
        <Container
          direction={"column"}
          fullWidth
          height={"50%"}
          justifyContent={"space-between"}
          padding={32}
        >
          <Container direction={"column"}>
            <Typography fontSize={18}>{"API KEY"}</Typography>
            <TextField
              type={"password"}
              error={error}
              height={48}
              width={"100%"}
              value={apiKey}
              onChange={e => {
                setError(false);
                setApiKey(e.target.value);
              }}
            />
            {error && <Typography fontSize={12}>{error}</Typography>}
          </Container>
          <Container
            direction={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Button height={48} onClick={handleLogin}>
              <Typography fontSize={16} bold>
                {"Login"}
              </Typography>
            </Button>
            <Typography
              fontSize={16}
              textDecoration={"underline"}
              userSelect={"none"}
              style={{
                cursor: "pointer",
              }}
              onClick={handleClickHowtoGenerateKey}
            >
              {"KEY 발급 받는법"}
            </Typography>
          </Container>
        </Container>
      </Container>
    </MainLayout>
  );
}
