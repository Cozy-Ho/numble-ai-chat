import Chat from "@/components/Chat";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ChatRoom = () => {
  const router = useRouter();
  useEffect(() => {
    if (!Boolean(sessionStorage.getItem("apiKey"))) {
      router.push("/");
    }
  }, [router]);
  return <Chat />;
};

export default ChatRoom;
