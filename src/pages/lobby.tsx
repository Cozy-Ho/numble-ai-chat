import { Button, Container, MainLayout, Typography } from "@/components/Common";
import { AddIcon, Logo, LogoText } from "@/components/Icons";

const Lobby = () => {
  //
  return (
    <MainLayout>
      <Container
        direction={"column"}
        fullWidth
        fullHeight
        padding={16}
        style={{
          position: "relative",
        }}
      >
        <Container
          justifyContent={"space-between"}
          fullWidth
          alignItems={"center"}
          style={{
            borderBottom: `1px solid #393939`,
          }}
        >
          <LogoText />
          <Button variant={"icon"}>
            <AddIcon />
          </Button>
        </Container>
        <div>This is lobby</div>
      </Container>
    </MainLayout>
  );
};

export default Lobby;
