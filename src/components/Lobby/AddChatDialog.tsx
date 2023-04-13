import { useState } from "react";
import { Button, Container, TextField, Typography } from "../Common";
import Dialog from "../Common/Dialog";

type AddChatDialogProps = {
  open: boolean;
  onClose: () => void;
};

const AddChatDialog = (props: AddChatDialogProps) => {
  const { open, onClose } = props;

  const [chatName, setChatName] = useState<string>("");
  const [chatMember, setChatMember] = useState<number>(0);
  //

  const handleChangeChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  const handleChangeChatMember = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setChatMember(0);
      return;
    }
    try {
      const number = Number(value);
      if (number < 2) {
        setChatMember(2);
        return;
      }
      if (number > 10) {
        setChatMember(10);
        return;
      }
      setChatMember(number);
    } catch (e) {
      console.log("error", e);
      setChatMember(0);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} width={"100%"} height={"50%"}>
      <Container
        direction={"column"}
        fullWidth
        padding={8}
        style={{
          flexGrow: 1,
        }}
      >
        <Container direction={"column"} padding={8}>
          <Typography>{"방 이름"}</Typography>
          <TextField
            width={"100%"}
            height={48}
            textDirection={"right"}
            value={chatName}
            onChange={handleChangeChatName}
          />
        </Container>
        <Container direction={"column"} padding={8}>
          <Typography>{"방 인원"}</Typography>
          <TextField
            width={"100%"}
            height={48}
            textDirection={"right"}
            value={chatMember.toString()}
            onChange={handleChangeChatMember}
          />
        </Container>
      </Container>
      <Container
        direction={"row"}
        fullWidth
        padding={16}
        justifyContent={"flex-end"}
      >
        <Button
          variant={"text"}
          color={"warn"}
          width={86}
          height={48}
          style={{
            margin: 8,
          }}
        >
          <Typography bold fontSize={18}>
            {"삭제"}
          </Typography>
        </Button>
        <Button
          variant={"text"}
          color={"main"}
          width={86}
          height={48}
          style={{
            margin: 8,
          }}
        >
          <Typography bold fontSize={18}>
            {"수정"}
          </Typography>
        </Button>
      </Container>
    </Dialog>
  );
};

export default AddChatDialog;
