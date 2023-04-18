type Props = {
  color?: string;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  onClick?: () => void;
};

const Logo = (props: Props) => {
  const { color = "#26D9FD", width = 108, height = 108 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 108 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M105.823 0V58.9208L0.0898438 0V4.17033V44.3842V104H1.3566V45.0991L107.09 104V100.326V59.6158V0H105.823Z"
        fill={color}
      />
    </svg>
  );
};

export default Logo;
