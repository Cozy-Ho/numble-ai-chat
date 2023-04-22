import { Button, Container, MainLayout } from "@/components/Common";
import Divider from "@/components/Common/Divider";
import { AddIcon, LogoText } from "@/components/Icons";
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
    const _result = await db.getAllChatRoom();
    if (_result.result) {
      console.log("success", _result.data);
      setChatList(_result.data);
    }
  }, []);

  const handleRemoveChat = useCallback(
    async (name: string) => {
      const db = new DB();
      await db.open();
      const _res_removeRoom = await db.removeChatRoom(name);
      const _res_removeChat = await db.removeAllChat(name);

      console.log("test", _res_removeChat.message);
      if (_res_removeRoom.result && _res_removeChat.result) {
        refetch();
      } else {
        alert(`방 삭제에 실패했습니다.\n${_res_removeRoom.message}`);
      }
      console.log("# removeChatRoom : ", _res_removeRoom);
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
    <MainLayout
      onFocus={refetch}
      style={{
        paddingTop: 60,
        paddingBottom: 0,
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
          justifyContent={"space-between"}
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
          <LogoText />
          <Button variant={"icon"} onClick={handleClickAddChat}>
            <AddIcon />
          </Button>
        </Container>
        <Divider
          direction={"row"}
          size={"100%"}
          style={{
            position: "fixed",
            top: 60,
          }}
        />
        <Container
          direction={"column"}
          style={{
            overflowY: "auto",
          }}
        >
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
      </Container>
      {openDialog && (
        <ChatDialog
          open={openDialog}
          type={type.current}
          onClose={handleCloseDialog}
          data={selected.current ?? undefined}
        />
      )}
    </MainLayout>
  );
};

export default Lobby;
