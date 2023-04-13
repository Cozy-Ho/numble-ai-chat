import { Theme } from "@emotion/react";
import styled from "@emotion/styled";

const getBorder = (
  theme: Theme,
  direction: "row" | "column",
  size?: React.CSSProperties["width"],
) => {
  if (direction === "row") {
    return {
      borderTop: `1px solid ${theme.palette.gray}`,
      height: 1,
      width: size ? size : "100%",
    };
  }
  return {
    borderLeft: `1px solid ${theme.palette.gray}`,
    width: 1,
    height: size ? size : "100%",
  };
};

interface DividerProps {
  direction?: "row" | "column";
  size?: React.CSSProperties["width"];
}

const Divider = styled("div")<DividerProps>(
  ({ theme, direction = "row", size }) => ({
    ...getBorder(theme, direction, size),
  }),
);

export default Divider;
