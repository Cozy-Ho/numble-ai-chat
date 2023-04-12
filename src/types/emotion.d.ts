import { Palette } from "@/theme/palette";
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    palette: Palette;
  }
}
