import { IconProps } from "./type";

const MoreIcon = (props: IconProps) => {
  //
  return (
    <svg
      fill="#fff"
      width="20"
      height="20"
      viewBox="-7 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <path d="M1,9A1,1,0,1,1,2,8,1,1,0,0,1,1,9ZM2,1A1,1,0,1,0,1,2,1,1,0,0,0,2,1ZM2,15a1,1,0,1,0-1,1A1,1,0,0,0,2,15Z" />
        </g>
      </g>
    </svg>
  );
};

export default MoreIcon;
