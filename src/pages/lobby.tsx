import Lobby from "@/components/Lobby";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LobbyPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!Boolean(sessionStorage.getItem("apiKey"))) {
      router.push("/");
    }
  }, [router]);
  //
  return <Lobby />;
};

export default LobbyPage;
