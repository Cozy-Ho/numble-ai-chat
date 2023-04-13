import { Button, Container, MainLayout } from "@/components/Common";
import Divider from "@/components/Common/Divider";
import { AddIcon, LogoText } from "@/components/Icons";
import AddChatDialog from "@/components/Lobby/AddChatDialog";
import { useState } from "react";

const Lobby = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClickAddChat = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //
  return (
    <MainLayout>
      <Container
        direction={"column"}
        fullWidth
        fullHeight
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
          <LogoText />
          <Button variant={"icon"} onClick={handleClickAddChat}>
            <AddIcon />
          </Button>
        </Container>
        <Divider direction={"row"} size={"100%"} />
        <div>chat list here</div>
      </Container>
      {openDialog && (
        <AddChatDialog open={openDialog} onClose={handleCloseDialog} />
      )}
    </MainLayout>
  );
};

export default Lobby;
