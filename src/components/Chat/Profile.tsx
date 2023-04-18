import styled from "@emotion/styled";
import { Container } from "../Common";
import Image from "next/image";

const StyledContainer = styled(Container)(({ theme }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  // backgroundColor: theme.palette.gray,
  border: `2px solid ${theme.palette.gray}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

type ProfileImageProps = {
  profileNumber: number;
};
const ProfileImage = (props: ProfileImageProps) => {
  const { profileNumber } = props;
  //

  return (
    <StyledContainer>
      <Image
        alt={"profile"}
        src={`/profile/profile_${profileNumber}.png`}
        width={40}
        height={40}
        fill={false}
      />
    </StyledContainer>
  );
};

export default ProfileImage;
