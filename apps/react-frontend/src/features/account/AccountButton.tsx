import { Avatar, Flex, Group, Text, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";

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
      <Group>
        <Flex direction="column" align="flex-end">
          <Text size="sm">{displayName}</Text>
          <Text size="xs" c="dimmed">
            {email}
          </Text>
        </Flex>

        <Avatar src={image} />
      </Group>
    </UnstyledButton>
  ),
);
AccountButton.displayName = "AccountButton";
