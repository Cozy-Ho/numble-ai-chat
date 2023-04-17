import { ColorType } from "@/theme/palette";
import styled from "@emotion/styled";

export interface ButtonProps extends React.ComponentProps<"button"> {
  color?: ColorType;
  variant?: "text" | "icon";
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}

const StyledButton = styled("button")<{
  color: ColorType;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}>(({ theme, color, width = "100%", height = 32 }) => ({
  overflow: "hidden",
  minWidth: 32,
  width: width,
  height: height,
  verticalAlign: "middle",
  border: "none",
  borderRadius: 4,
  backgroundColor: theme.palette[color],
  color: color === "darkGray" || color === "gray" ? "white" : "black",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  cursor: "pointer",
}));

const StyledIconButton = styled("button")<{
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}>(({ theme, width = 32, height = 32 }) => ({
  overflow: "hidden",
  minWidth: 32,
  width: width,
  height: height,
  verticalAlign: "middle",
  border: "none",
  borderRadius: 8,
  backgroundColor: "transparent",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
  cursor: "pointer",
}));

const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    color = "main",
    variant = "text",
    ...rest
  } = props;
  //
  return (
    <>
      {variant === "icon" ? (
        <StyledIconButton onClick={onClick} {...rest}>
          {children}
        </StyledIconButton>
      ) : (
        <StyledButton onClick={onClick} color={color} {...rest}>
          {children}
        </StyledButton>
      )}
    </>
  );
};

export default Button;
