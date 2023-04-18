import { useRouter } from "next/router";
import {
  Button,
  Container,
  MainLayout,
  TextField,
  Typography,
  Divider,
  Loading,
} from "../Common";
import { BackIcon, SendIcon } from "../Icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DB, { Chat, ChatRoom } from "@/utils/DB";
import ChatBox from "./ChatBox";
import { v4 } from "uuid";
import { ChatCompletionRequestMessage } from "openai";

// 사용자 입력을 기다리는 최대 시간
const MAX_COUNT = 5;

const Chat = () => {
  const router = useRouter();

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // AI 자동응답 여부
  const [autoReply, setAutoReply] = useState<boolean>(false);

  // ChatRoom info
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);

  // for timer
  const [count, setCount] = useState(MAX_COUNT);
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const countTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { id } = router.query;

  // fetch ChatRoom data.
  useEffect(() => {
    setLoading(true);
    if (id) {
      const db = new DB();
      db.open().then(() => {
        db.getChatRoom(id as string).then(result => {
          if (result.result) {
            setChatRoom(result.data);
          } else {
            setChatRoom(null);
          }
          setLoading(false);
        });
      });
    }
  }, [id]);

  const fetchChat = useCallback(async () => {
    if (id) {
      const db = new DB();
      await db.open();
      const _result = await db.getChatList(id as string);
      if (_result.result) {
        // 시간순으로 정렬
        const sorted = _result.data.sort((a: Chat, b: Chat) => {
          return a.time.getTime() - b.time.getTime();
        });
        setChatList(sorted);
      }
    }
  }, [id]);

  const fetchReply = useCallback(async () => {
    if (!chatRoom) return;
    const key = sessionStorage.getItem("apiKey") || null;

    // query 용 메세지 포맷
    const messages: ChatCompletionRequestMessage[] = chatList.map(chat => {
      return {
        role: chat.role === "user" ? "user" : "assistant",
        name: chat.name.toString(),
        content: chat.message,
      };
    });
    const _result = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: key,
        messages: messages,
      }),
    });

    const _data = await _result.json();
    if (_data.error) {
      console.log(_data.error);
      return;
    }

    const setWhosReply: number = (() => {
      if (chatRoom.memberList && chatRoom.memberList.length > 1) {
        // 마지막 채팅이 사용자가 한 것이면 AI들 중 랜덤으로 선택
        if (chatList[chatList.length - 1].role === "user") {
          return chatRoom.memberList[
            Math.floor(Math.random() * chatRoom.memberList.length)
          ];
        } else {
          // 마지막 채팅이 사용자가 아니면 마지막 채팅을 제외한 AI 중 랜덤으로 선택
          const _exceptLastOne = chatRoom.memberList.filter(
            item => item !== chatList[chatList.length - 1].name,
          );
          return _exceptLastOne[
            Math.floor(Math.random() * _exceptLastOne.length)
          ];
        }
      }
      return 0;
    })();

    // 채팅 추가
    const db = new DB();
    await db.open();
    const _res = await db.createChat({
      id: v4(),
      roomId: id as string,
      name: setWhosReply,
      message: _data.result.content,
      role: "assistant",
    });
    if (_res.result) {
      await fetchChat();
    } else {
      console.log("fail to create chat");
    }
  }, [chatRoom, chatList, fetchChat, id]);

  const handleClickBack = () => {
    router.replace("/lobby");
  };

  // 사용자 입력을 기다리는 시간을 초기화
  const onResetTimer = useCallback(() => {
    if (timeId.current) clearTimeout(timeId.current);

    timeId.current = setTimeout(() => {
      timeId.current = null;
      setCount(MAX_COUNT);
    }, MAX_COUNT);
  }, []);

  // 타이머
  useEffect(() => {
    const countDown = () => {
      if (countTimerRef.current) {
        clearTimeout(countTimerRef.current);
      }
      countTimerRef.current = setTimeout(() => {
        countTimerRef.current = null;
        if (count) {
          setCount(prev => prev - 1);
        } else {
          // TODO: on timeout;
          console.log("TIMEOUT !! ");
        }
      }, 1000);
    };
    if (autoReply) {
      countDown();
    }
  }, [count, autoReply]);

  const handleClickSend = async () => {
    if (id) {
      const db = new DB();
      await db.open();
      const _result = await db.createChat({
        roomId: id as string,
        id: v4(),
        message: inputText,
        role: "user",
        name: 0,
      });
      if (_result.result) {
        setInputText("");
        await fetchChat();
        await fetchReply();
      } else {
        alert(_result.message);
      }
    }
  };

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  // 사용자 입력 감지 이벤트 리스너
  useEffect(() => {
    window.addEventListener("click", onResetTimer, true);
    window.addEventListener("keydown", onResetTimer, true);

    return () => {
      window.removeEventListener("click", onResetTimer, true);
      window.removeEventListener("keydown", onResetTimer, true);

      if (timeId.current) clearTimeout(timeId.current);
      if (countTimerRef.current) clearTimeout(countTimerRef.current);
    };
  }, [onResetTimer]);

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
          <Typography fontSize={20}>{chatRoom?.name || ""}</Typography>
        </Container>
        <Divider direction={"row"} size={"100%"} />
        {loading && <Loading />}
        <Container
          direction={"column"}
          padding={8}
          style={{
            overflowY: "auto",
          }}
        >
          {chatList.map((chat: Chat) => {
            return <ChatBox key={chat.id} chatData={chat} />;
          })}
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
          <TextField
            maxLength={100}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && inputText.length > 0) {
                handleClickSend();
              }
            }}
            endIcon={
              <Button variant={"icon"} onClick={handleClickSend}>
                <SendIcon />
              </Button>
            }
          />
        </Container>
      </Container>
    </MainLayout>
  );
};
export default Chat;
