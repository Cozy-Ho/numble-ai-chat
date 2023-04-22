import { useRouter } from "next/router";
import {
  Button,
  Container,
  MainLayout,
  TextField,
  Typography,
  Divider,
} from "../Common";
import { BackIcon, SendIcon } from "../Icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DB, { Chat, ChatRoom } from "@/utils/DB";
import ChatBox from "./ChatBox";
import { v4 } from "uuid";
import { ChatCompletionRequestMessage } from "openai";

// 사용자 입력을 기다리는 최대 시간
const MAX_COUNT = 7;

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
  const countTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  const { id } = router.query;

  // fetch ChatRoom data.
  useEffect(() => {
    if (id) {
      const db = new DB();
      db.open().then(() => {
        db.getChatRoom(id as string).then(result => {
          if (result.result) {
            setChatRoom(result.data);
          } else {
            setChatRoom(null);
          }
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
        return sorted;
      }
    }
  }, [id]);

  const fetchReply = useCallback(
    async (_chat: Chat[]) => {
      if (!chatRoom) return;
      setLoading(true);
      const key = sessionStorage.getItem("apiKey") || null;

      // query 용 메세지 포맷
      const messages: ChatCompletionRequestMessage[] = _chat.map(chat => {
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
        // API error => 자동응답 중지
        setAutoReply(false);
        setLoading(false);
        return;
      }

      const setWhosReply: number = (() => {
        if (chatRoom.memberList) {
          if (chatRoom.memberList.length > 1) {
            // 마지막 채팅이 사용자가 한 것이면 AI들 중 랜덤으로 선택
            if (_chat[_chat.length - 1].role === "user") {
              return chatRoom.memberList[
                Math.floor(Math.random() * chatRoom.memberList.length)
              ];
            } else {
              // 마지막 채팅이 사용자가 아니면 마지막 채팅을 제외한 AI 중 랜덤으로 선택
              const _exceptLastOne = chatRoom.memberList.filter(
                item => item !== _chat[_chat.length - 1].name,
              );
              return _exceptLastOne[
                Math.floor(Math.random() * _exceptLastOne.length)
              ];
            }
          }
          if (chatRoom.memberList.length < 2) {
            return chatRoom.memberList[0];
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
      setLoading(false);
    },
    [chatRoom, fetchChat, id],
  );

  const handleClickBack = () => {
    router.replace("/lobby");
  };

  // 사용자 입력을 기다리는 시간을 초기화
  const onResetTimer = useCallback(() => {
    console.log("reset timer!");
    setCount(MAX_COUNT);
  }, []);

  const fetchAutoReply = useCallback(async () => {
    if (loading) return;
    // 마지막 채팅이 사용자가 보낸 것 이라면, 자동응답이 아님
    if (chatList[chatList.length - 1].role === "user") {
      onResetTimer();
      return;
    }
    await fetchReply(chatList);
    onResetTimer();
  }, [fetchReply, chatList, onResetTimer, loading]);

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
          console.log("TIMEOUT !! ");
          fetchAutoReply();
        }
      }, 1000);
    };
    if (autoReply) {
      countDown();
    }
  }, [count, fetchAutoReply, autoReply]);

  useEffect(() => {
    if (chatList.length > 0) {
      if (chatRoom && chatRoom.memberCount > 2) {
        // 맴버가 3명이상 && 사용자가 채팅을 보냈던 경우
        setAutoReply(true);
      }
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }
  }, [chatList, chatRoom]);

  // 사용자가 채팅을 보내는 경우
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
        const _data = await fetchChat();
        if (_data) {
          await fetchReply(_data);
        }
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
    window.addEventListener("scroll", onResetTimer, true);
    window.addEventListener("keydown", onResetTimer, true);

    return () => {
      window.removeEventListener("click", onResetTimer, true);
      window.removeEventListener("scroll", onResetTimer, true);
      window.removeEventListener("keydown", onResetTimer, true);

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
        fullHeight
        style={{
          position: "relative",
          minHeight: 540,
        }}
      >
        <Container
          justifyContent={"flex-start"}
          alignItems={"center"}
          padding={12}
          style={{
            position: "fixed",
            top: 0,
            height: 60,
          }}
        >
          <Button variant={"icon"} width={24} onClick={handleClickBack}>
            <BackIcon />
          </Button>
          <Typography fontSize={20}>{chatRoom?.name || ""}</Typography>
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
          padding={8}
          style={{
            overflowY: "auto",
          }}
        >
          {chatList.map((chat: Chat) => {
            return (
              <ChatBox ref={messageBoxRef} key={chat.id} chatData={chat} />
            );
          })}
        </Container>
        {loading && (
          <Typography
            fontSize={12}
            paddingLeft={8}
            style={{
              position: "fixed",
              bottom: 52,
            }}
          >
            {"AI is typing..."}
          </Typography>
        )}
        <Container
          width={"100%"}
          height={60}
          padding={8}
          style={{
            position: "fixed",
            bottom: 0,
            maxWidth: 960,
          }}
        >
          <TextField
            maxLength={100}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            endIcon={
              <Button
                variant={"icon"}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (inputText.length > 0) {
                    handleClickSend();
                  }
                }}
              >
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
