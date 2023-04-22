import { useCallback, useState } from "react";
import { Button, Container, TextField, Typography } from "../Common";
import Dialog from "../Common/Dialog";
import DB, { ChatRoom } from "@/utils/DB";
import { v4 } from "uuid";

type AddChatDialogProps = {
  open: boolean;
  data?: ChatRoom;
  type?: "add" | "edit";
  onClose: () => void;
};

type InputError = {
  chatName: boolean;
  chatMember: boolean;
};

const ChatDialog = (props: AddChatDialogProps) => {
  const { open, type = "add", data = null, onClose } = props;

  const [chatName, setChatName] = useState<string>(data ? data.name : "");
  const [chatMember, setChatMember] = useState<number>(
    data ? data.memberCount : 0,
  );
  const [inputError, setInputError] = useState<InputError>({
    chatName: false,
    chatMember: false,
  });

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
    if (!isNaN(parsedvalue) && parsedvalue > 0 && parsedvalue < 6) {
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
        const db = new DB();
        await db.open();
        const _result = await db.createChatRoom({
          id: v4(),
          name: name,
          memberCount: count,
          // 사용자를 제외한 나머지 랜덤한 멤버. 프로필 사진 유지를 위한 용도로 1~7 사이의 숫자로 임의 지정합니다.
          memberList: Array.from(
            { length: count - 1 },
            () => Math.floor(Math.random() * 7) + 1,
          ),
        });
        if (_result.result) {
          // success
          onClose();
        } else {
          // duplicate key
          if (_result.message === "key already exist") {
            alert("이미 존재하는 방 이름입니다.");
            return;
          }
          alert(`방 생성에 실패했습니다.\n${_result.message}`);
        }
        console.log("# createChatRoom : ", _result);
      }
    },
    [validateInputs, onClose],
  );

  const handleRemoveChat = useCallback(
    async (name: string) => {
      const db = new DB();
      await db.open();
      const _result = await db.removeChatRoom(name);
      if (_result.result) {
        // success
        onClose();
      } else {
        alert(`방 삭제에 실패했습니다.\n${_result.message}`);
      }
      console.log("# removeChatRoom : ", _result);
    },
    [onClose],
  );

  const handleEditChat = useCallback(
    async (id: string, name: string, count: number) => {
      if (validateInputs()) {
        // 방 수정
        const db = new DB();
        await db.open();
        const _result = await db.updateChatRoom({
          id: id,
          name: name,
          memberCount: count,
        });
        if (_result.result) {
          // success
          onClose();
        } else {
          alert(`방 수정에 실패했습니다.\n${_result.message}`);
        }
        console.log("# editChatRoom : ", _result);
      }
    },
    [validateInputs, onClose],
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
        <>
          {type === "add" && (
            <Button
              height={48}
              onClick={() => handleCreateChat(chatName, chatMember)}
            >
              <Typography bold fontSize={18}>
                {"방 생성"}
              </Typography>
            </Button>
          )}
          {type === "edit" && data && (
            <Container>
              <Button
                height={48}
                width={82}
                color={"warn"}
                onClick={() => handleRemoveChat(chatName)}
              >
                <Typography bold fontSize={18}>
                  {"삭제"}
                </Typography>
              </Button>
              <Button
                height={48}
                width={82}
                onClick={() => handleEditChat(data.id, chatName, chatMember)}
              >
                <Typography bold fontSize={18}>
                  {"수정"}
                </Typography>
              </Button>
            </Container>
          )}
        </>
      </Container>
    </Dialog>
  );
};

export default ChatDialog;
