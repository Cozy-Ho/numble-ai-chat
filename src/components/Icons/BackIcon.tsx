import { IconProps } from "./type";

const BackIcon = (props: IconProps) => {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.0898 1L2.08984 13L14.0898 25"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};

export default BackIcon;
