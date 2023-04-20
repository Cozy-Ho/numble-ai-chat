import { Chat } from "@/utils/DB";
import { Container, Typography } from "../Common";
import styled from "@emotion/styled";
import { InputNameType, genName } from "@/utils/generateName";

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.gray,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
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
      <Typography fontSize={12} bold textDecoration={"underline"}>
        {`${data.role}-${genName(data.name as InputNameType)}`}
      </Typography>
      <Typography fontSize={14}>{data.message}</Typography>
    </StyledContainer>
  );
};

export default MessageBox;
