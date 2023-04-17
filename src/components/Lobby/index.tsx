import { Button, Container, MainLayout, Typography } from "@/components/Common";
import Divider from "@/components/Common/Divider";
import { AddIcon, LogoText, MoreIcon } from "@/components/Icons";
import ChatDialog from "@/components/Lobby/ChatDialog";
import DB, { ChatRoom } from "@/utils/DB";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatRoomContainer from "./ChatRoom";

const Lobby = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [chatList, setChatList] = useState<ChatRoom[]>([]);
  const type = useRef<"add" | "edit">("add");
  const selected = useRef<ChatRoom | null>(null);

  const router = useRouter();

  const refetch = useCallback(async () => {
    const db = new DB();
    await db.open();
    const _result = await db.getAllChtRoom();
    if (_result.result) {
      console.log("success", _result.data);
      setChatList(_result.data);
    }
  }, []);

  const handleRemoveChat = useCallback(
    async (name: string) => {
      const db = new DB();
      await db.open();
      const _result = await db.removeChatRoom(name);
      if (_result.result) {
        refetch();
      } else {
        alert(`방 삭제에 실패했습니다.\n${_result.message}`);
      }
      console.log("# removeChatRoom : ", _result);
    },
    [refetch],
  );

  // 최초 렌더링시 refetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleClickAddChat = () => {
    setOpenDialog(true);
  };

  const handleClickEditChat = (input: ChatRoom) => {
    type.current = "edit";
    selected.current = input;
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    refetch();
  };

  const handleClickChatRoom = (id: string) => {
    console.log("# chat id : ", id);
    router.push({
      pathname: "/chatroom",
      query: {
        id: id,
      },
    });
  };
  //
  return (
    <MainLayout onFocus={refetch}>
      <Container
        direction={"column"}
        fullWidth
        fullHeight
        style={{
          position: "relative",
        }}
      >
        <Container
          justifyContent={"space-between"}
          fullWidth
          alignItems={"center"}
          padding={12}
        >
          <LogoText />
          <Button variant={"icon"} onClick={handleClickAddChat}>
            <AddIcon />
          </Button>
        </Container>
        <Divider direction={"row"} size={"100%"} />
        {chatList.map(chat => {
          return (
            <ChatRoomContainer
              key={chat.id}
              chat={chat}
              handleClickChatRoom={handleClickChatRoom}
              handleClickEditChat={handleClickEditChat}
              handleRemoveChat={handleRemoveChat}
            />
          );
        })}
      </Container>
      {openDialog && (
        <ChatDialog
          open={openDialog}
          type={type.current}
          onClose={handleCloseDialog}
          chatName={selected.current?.id}
          chatMember={selected.current?.memberCount}
        />
      )}
    </MainLayout>
  );
};

export default Lobby;
