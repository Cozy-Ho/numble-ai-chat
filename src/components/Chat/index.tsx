import { useRouter } from "next/router";
import {
  Button,
  Container,
  MainLayout,
  TextField,
  Typography,
} from "../Common";
import Divider from "../Common/Divider";
import { AddIcon, BackIcon } from "../Icons";
import { useCallback, useEffect, useState } from "react";
import DB, { Chat } from "@/utils/DB";

const Chat = () => {
  const router = useRouter();

  const [chatList, setChatList] = useState<Chat[]>([]);

  const { id } = router.query;

  const fetchChat = useCallback(async () => {
    if (id) {
      const db = new DB();
      await db.open();
      const _result = await db.getChatList(id as string);
      if (_result.result) {
        console.log("success", _result.data);
        const sorted = _result.data.sort((a: Chat, b: Chat) => {
          return a.time.getTime() - b.time.getTime();
        });
        setChatList(sorted);
      }
    }
  }, [id]);

  const handleClickBack = () => {
    router.replace("/lobby");
  };

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return (
    <MainLayout
      style={{
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      <Container
        direction={"column"}
        fullWidth
        fullHeight
        style={{
          position: "relative",
          minHeight: 540,
        }}
      >
        <Container
          justifyContent={"flex-start"}
          fullWidth
          alignItems={"center"}
          padding={12}
          style={{
            position: "fixed",
            top: 0,
            height: 60,
            width: "100%",
          }}
        >
          <Button variant={"icon"} width={24} onClick={handleClickBack}>
            <BackIcon />
          </Button>
          <Typography fontSize={20}>{id}</Typography>
        </Container>
        <Divider direction={"row"} size={"100%"} />
        <Container
          direction={"column"}
          padding={8}
          style={{
            overflowY: "auto",
          }}
        >
          {"CHAT"}
        </Container>
        <Container
          width={"100%"}
          height={60}
          padding={8}
          style={{
            position: "fixed",
            bottom: 0,
          }}
        >
          <TextField endIcon={<AddIcon />} />
        </Container>
      </Container>
    </MainLayout>
  );
};
export default Chat;
