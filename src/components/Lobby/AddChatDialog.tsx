import { Button, Container, TextField, Typography } from "../Common";
import Dialog from "../Common/Dialog";

type AddChatDialogProps = {
  open: boolean;
  onClose: () => void;
};

const AddChatDialog = (props: AddChatDialogProps) => {
  const { open, onClose } = props;
  //
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
          <TextField width={"100%"} height={48} textDirection={"right"} />
        </Container>
        <Container direction={"column"} padding={8}>
          <Typography>{"방 인원"}</Typography>
          <TextField width={"100%"} height={48} textDirection={"right"} />
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
