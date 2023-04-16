import { useCallback, useState } from "react";
import { Button, Container, TextField, Typography } from "../Common";
import Dialog from "../Common/Dialog";
import DB from "@/utils/DB";

type AddChatDialogProps = {
  open: boolean;
  onClose: () => void;
};

type InputError = {
  chatName: boolean;
  chatMember: boolean;
};

const AddChatDialog = (props: AddChatDialogProps) => {
  const { open, onClose } = props;

  const [chatName, setChatName] = useState<string>("");
  const [chatMember, setChatMember] = useState<number>(0);
  const [inputError, setInputError] = useState<InputError>({
    chatName: false,
    chatMember: false,
  });
  //

  const handleChangeChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
    setInputError(prev => ({
      ...prev,
      chatName: false,
    }));
  };

  const handleChangeChatMember = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError(prev => ({
      ...prev,
      chatMember: false,
    }));
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

  const validateInputs = useCallback((): boolean => {
    if (chatName === "" || chatName.length < 2 || chatName.length > 10) {
      setInputError(prev => ({
        ...prev,
        chatName: true,
      }));
      return false;
    }
    if (chatMember < 2 || chatMember > 5) {
      setInputError(prev => ({
        ...prev,
        chatMember: true,
      }));
      return false;
    }
    return true;
  }, [chatName, chatMember]);

  const handleCreateChat = useCallback(
    async (name: string, count: number) => {
      if (validateInputs()) {
        // 방 생성
        if (!indexedDB) {
          alert("indexedDB를 지원하지 않는 브라우저입니다.");
          return;
        }
        const db = await new DB(indexedDB);
        const _result = await db.createChatRoom({
          id: "test",
          name: name,
          memberCount: count + 1,
        });
      }
      //
    },
    [validateInputs],
  );

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
            error={inputError.chatName}
            height={48}
            textDirection={"right"}
            value={chatName}
            onChange={handleChangeChatName}
          />
          {inputError.chatName && (
            <Typography fontSize={12}>
              {"방 이름은 2자 이상 10자 이하로 설정해주세요."}
            </Typography>
          )}
        </Container>
        <Container direction={"column"} padding={8}>
          <Typography>{"방 인원"}</Typography>
          <TextField
            width={"100%"}
            height={48}
            error={inputError.chatMember}
            textDirection={"right"}
            value={chatMember.toString()}
            onChange={handleChangeChatMember}
          />
          {inputError.chatMember && (
            <Typography fontSize={12}>
              {"방 인원은 2명 이상 5명 이하로 설정해주세요."}
            </Typography>
          )}
        </Container>
      </Container>
      <Container
        direction={"row"}
        fullWidth
        padding={16}
        justifyContent={"flex-end"}
      >
        <Button
          height={48}
          onClick={() => handleCreateChat(chatName, chatMember)}
        >
          <Typography bold fontSize={18}>
            {"방 생성"}
          </Typography>
        </Button>
      </Container>
    </Dialog>
  );
};

export default AddChatDialog;
