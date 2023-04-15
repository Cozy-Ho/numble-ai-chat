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
    const parsedvalue = parseInt(value);
    if (value === "") {
      setChatMember(0);
      return;
    }
    if (!isNaN(parsedvalue) && parsedvalue > 0 && parsedvalue < 5) {
      setChatMember(parsedvalue);
    }
  };

  const validateInputs = (): boolean => {
    if (chatName === "" || chatName.length < 2 || chatName.length > 10) {
      alert("방 이름은 2자 이상 10자 이하로 설정해주세요.");
      return false;
    }
    if (chatMember < 2 || chatMember > 5) {
      alert("방 인원은 2명 이상 5명 이하로 설정해주세요.");
      return false;
    }
    return true;
  };

  const handleCreateChat = () => {
    if (validateInputs()) {
      // 방 생성
      const request = indexedDB.open("chat", 2);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("chat", {
          keyPath: "id",
        });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("member", "member", { unique: false });
      };
    }
    //
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
        <Button height={48} onClick={handleCreateChat}>
          <Typography bold fontSize={18}>
            {"방 생성"}
          </Typography>
        </Button>
      </Container>
    </Dialog>
  );
};

export default AddChatDialog;
