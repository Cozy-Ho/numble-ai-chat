import { Chat } from "@/utils/DB";
import { Container, Typography } from "../Common";
import ProfileImage from "./Profile";
import MessageBox from "./MessageBox";
import { forwardRef } from "react";

type ChatBoxProps = {
  chatData: Chat;
};

const ChatBox = forwardRef<HTMLDivElement, ChatBoxProps>((props, ref) => {
  const { chatData } = props;

  //
  return (
    <Container
      ref={ref}
      padding={8}
      style={{
        wordBreak: "break-word",
        direction: chatData.role === "user" ? "rtl" : "ltr",
      }}
    >
      <ProfileImage profileNumber={chatData.name} />
      <MessageBox data={chatData} />
      <Container fullHeight direction={"column"} justifyContent={"flex-end"}>
        <Typography fontSize={12} paddingLeft={8}>
          {`${chatData.time
            .getHours()
            .toString()
            .padStart(2, "0")}:${chatData.time
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}
        </Typography>
      </Container>
    </Container>
  );
});

ChatBox.displayName = "ChatBox";

export default ChatBox;
