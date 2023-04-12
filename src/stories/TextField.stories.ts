import type { Meta, StoryObj } from "@storybook/react";

import { TextField } from "../components/Common";

const meta: Meta<typeof TextField> = {
  title: "Example/TextField",
  component: TextField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Primary: Story = {
  args: {
    height: 48,
  },
};
export const Secondary: Story = {
  args: {},
};
export const Warn: Story = {
  args: {},
};
