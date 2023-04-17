import { useRouter } from "next/router";
import { Button, Container, MainLayout, Typography } from "../Common";
import Divider from "../Common/Divider";
import { BackIcon } from "../Icons";
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
        setChatList(_result.data);
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
    <MainLayout>
      <Container
        direction={"column"}
        fullWidth
        fullHeight
        style={{
          position: "relative",
        }}
      >
        <Container
          justifyContent={"flex-start"}
          fullWidth
          alignItems={"center"}
          padding={12}
        >
          <Button variant={"icon"} width={24} onClick={handleClickBack}>
            <BackIcon />
          </Button>
          <Typography fontSize={20}>{id}</Typography>
        </Container>
        <Divider direction={"row"} size={"100%"} />
        <div>Chat</div>
        <div>{id}</div>
      </Container>
    </MainLayout>
  );
};
export default Chat;
