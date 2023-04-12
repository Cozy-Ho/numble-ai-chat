import styled from "@emotion/styled";
import React from "react";

interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "onClick" | "onFocus" | "width"> {
  label?: string;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  error?: string | boolean;
  placeholder?: string;
  textDirection?: "left" | "right";
  onClick?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  color?: React.CSSProperties["color"];
}

const StyledFieldSet = styled("fieldset")<{
  focus: boolean;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  error?: string | boolean;
}>(({ theme, width = "100%", height = "100%", focus, error = false }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  margin: 0,
  width: width,
  height: height,
  border: `${focus ? 1.1 : 1}px solid ${
    error ? theme.palette.warn : focus ? "#fff" : "#393939"
  }`,
  boxSizing: "border-box",
  borderRadius: 6,
  "&:hover": {
    border: `${focus ? 1.1 : 1}px solid ${
      error ? theme.palette.warn : focus ? "#fff" : "#393939"
    }`,
  },
}));

const StyledInputField = styled("input")<{
  textDirection: "left" | "right";
}>(({ theme, textDirection }) => ({
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  resize: "none",
  color: "white",
  fontSize: 24,
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "normal",
  textAlign: textDirection === "left" ? "start" : "end",
  whiteSpace: "nowrap",
  overflow: "hidden",
  backgroundColor: "transparent",
  cursor: "text",
  textDecoration: "none",
}));

const TextField = (props: TextFieldProps) => {
  const {
    label,
    width,
    height,
    placeholder,
    error,
    onClick,
    onFocus = () => {},
    onChange = () => {},
    onBlur = () => {},
    textDirection = "left",
    color,
    ...rest
  } = props;
  const [focus, setFocus] = React.useState(false);

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setFocus(true);
    onFocus(e);
  };

  return (
    <StyledFieldSet focus={focus} width={width} height={height} error={error}>
      <StyledInputField
        color={""}
        textDirection={textDirection}
        onFocus={onInputFocus}
        onBlur={e => {
          setFocus(false);
          onBlur(e);
        }}
        onChange={onChange}
        {...rest}
      />
    </StyledFieldSet>
  );
};

export default TextField;
