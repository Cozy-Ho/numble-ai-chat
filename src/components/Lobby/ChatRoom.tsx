import { ChatRoom } from "@/utils/DB";
import { Button, Container, Typography } from "../Common";
import Divider from "../Common/Divider";
import { MoreIcon } from "../Icons";
import { forwardRef, useEffect, useRef, useState } from "react";

type ChatRoomPopoverProps = {
  open: boolean;
  children: React.ReactNode;
  content: React.ReactNode;
};

const ChatRoomPopover = forwardRef<HTMLDivElement, ChatRoomPopoverProps>(
  (props, ref) => {
    const { open, content, children } = props;

    return (
      <Container ref={ref}>
        {!open && <Container>{content}</Container>}
        {open && <>{children}</>}
      </Container>
    );
  },
);
ChatRoomPopover.displayName = "ChatRoomPopover";

type ChatRoomProps = {
  chat: ChatRoom;
  handleClickChatRoom: (id: string) => void;
  handleClickEditChat(input: ChatRoom): void;
  handleRemoveChat: (name: string) => void;
};

const ChatRoomContainer = (props: ChatRoomProps) => {
  const { chat, handleClickChatRoom, handleClickEditChat, handleRemoveChat } =
    props;
  const [open, setOpen] = useState<boolean>(false);

  const popOverRef = useRef<HTMLDivElement>(null);
  //
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popOverRef.current &&
        !popOverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popOverRef]);

  return (
    <Container
      onClick={() => {
        handleClickChatRoom(chat.id);
      }}
      direction={"column"}
      fullWidth
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
        <Container
          width={140}
          style={{
            overflow: "hidden",
          }}
        >
          <Typography fontSize={"24"}>{chat.id}</Typography>
        </Container>
        <ChatRoomPopover
          open={open}
          ref={popOverRef}
          content={
            <Button
              variant={"icon"}
              onClick={e => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <MoreIcon />
            </Button>
          }
        >
          <>
            <Button
              variant={"text"}
              color={"main"}
              width={82}
              onClick={e => {
                e.stopPropagation();
                handleClickEditChat({
                  id: chat.id,
                  memberCount: chat.memberCount,
                });
              }}
            >
              {"수정"}
            </Button>
            <Button
              variant={"text"}
              color={"warn"}
              width={82}
              onClick={e => {
                e.stopPropagation();
                handleRemoveChat(chat.id);
              }}
            >
              {"나가기"}
            </Button>
          </>
        </ChatRoomPopover>
        {/* {!openButtons && (
          <Button
            variant={"icon"}
            onClick={e => {
              e.stopPropagation();
              setOpenButtons(true);
            }}
          >
            <MoreIcon />
          </Button>
        )}
        {openButtons && (
          <Container
            onBlur={() => {
              setOpenButtons(false);
            }}
          >
            <Button
              variant={"text"}
              color={"main"}
              width={82}
              onClick={e => {
                e.stopPropagation();
                handleClickEditChat({
                  id: chat.id,
                  memberCount: chat.memberCount,
                });
              }}
            >
              {"수정"}
            </Button>
          </Container>
        )} */}
      </Container>
      <Divider direction={"row"} size={"100%"} />
    </Container>
  );
};

export default ChatRoomContainer;
