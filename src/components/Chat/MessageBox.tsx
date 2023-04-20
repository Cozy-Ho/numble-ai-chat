import { Chat } from "@/utils/DB";
import { Container, Typography } from "../Common";
import styled from "@emotion/styled";

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.gray,
  borderRadius: "10px",
  padding: 8,
  maxWidth: "70%",
  wordBreak: "break-word",
  direction: "ltr",
}));

type MessageBoxProps = {
  data: Chat;
};

const MessageBox = (props: MessageBoxProps) => {
  const { data } = props;
  //
  return (
    <StyledContainer>
      <Typography fontSize={14}>{data.message}</Typography>
    </StyledContainer>
  );
};

export default MessageBox;
