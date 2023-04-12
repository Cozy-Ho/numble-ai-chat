import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../components/Common";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["main", "warn", "gray", "darkGray"],
      },
    },
    children: {
      control: "ReactNode",
    },
    onClick: {
      control: {
        type: "function",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    color: "main",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    color: "warn",
    children: "Button",
  },
};
