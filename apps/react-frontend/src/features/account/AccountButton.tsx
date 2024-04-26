import { Avatar, Flex, Group, Paper, Text, UnstyledButton, alpha } from "@mantine/core";
import { forwardRef } from "react";
import { GlassPaper } from "../glass/GlassPaper";

export interface AccountButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /** The URL to the avatar for this account. */
  image?: string;

  /** The display name of this account. */
  displayName?: string;

  /** The email of this account. */
  email?: string;
}

export const AccountButton = forwardRef<HTMLButtonElement, AccountButtonProps>(
  ({ image, displayName, email, ...props }: AccountButtonProps, ref) => (
    <UnstyledButton ref={ref} {...props}>
      <GlassPaper>
        <Group p="14px">
          <Flex direction="column" align="flex-end">
            <Text size="md" fw={500}>
              {displayName}
            </Text>
            <Text size="sm" fw={200}>
              {email}
            </Text>
          </Flex>

          <Avatar src={image} />
        </Group>
      </GlassPaper>
    </UnstyledButton>
  ),
);
AccountButton.displayName = "AccountButton";
