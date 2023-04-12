import styled from "@emotion/styled";

type StyledTypographyProps = {
  bold?: boolean;
  fontSize?: React.CSSProperties["fontSize"];
  wrap?: React.CSSProperties["whiteSpace"];
  paddingLeft?: React.CSSProperties["paddingLeft"];
  userSelect?: React.CSSProperties["userSelect"];
  textAlign?: React.CSSProperties["textAlign"];
  textDecoration?: React.CSSProperties["textDecoration"];
};

const getBold = (bold?: boolean) => {
  if (bold) return { fontWeight: "bold" };
  return {};
};

const StyledTypography = styled("span")<StyledTypographyProps>(
  ({
    theme,
    bold = false,
    color,
    wrap,
    fontSize = 24,
    paddingLeft = 0,
    userSelect,
    textAlign,
    textDecoration,
  }) => ({
    fontStretch: "normal",
    fontStyle: "normal",
    color: color,
    margin: 0,
    paddingLeft,
    fontFamily: "Noto Sans",
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSize: fontSize,
    fontWeight: 400,
    lineHeight: "normal",
    letterSpacing: "normal",
    whiteSpace: wrap,
    userSelect,
    textAlign,
    textDecoration,
    marginTop: 4,
    marginBottom: 4,
    ...getBold(bold),
  }),
);

export interface TyphographyProps extends React.ComponentProps<"span"> {
  bold?: boolean;
  fontSize?: React.CSSProperties["fontSize"];
  wrap?: React.CSSProperties["whiteSpace"];
  paddingLeft?: React.CSSProperties["paddingLeft"];
  userSelect?: React.CSSProperties["userSelect"];
  textAlign?: React.CSSProperties["textAlign"];
  textDecoration?: React.CSSProperties["textDecoration"];
}

const Typography = (props: TyphographyProps) => {
  const {
    children,
    color = "textPrimary",
    bold = false,
    wrap,
    paddingLeft,
    ...others
  } = props;
  return (
    <StyledTypography
      color={color}
      bold={bold}
      wrap={wrap}
      paddingLeft={paddingLeft}
      {...others}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography;
