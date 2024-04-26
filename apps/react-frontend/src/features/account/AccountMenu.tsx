import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from "@mantine/core";
import { IconLogout, IconMail, IconUser } from "@tabler/icons-react";
import { AccountButton } from "./AccountButton";

export default function AccountMenu() {
  const { user, logout } = useAuth0();

  const iconWidth = "32px";

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <AccountButton image={user?.picture} displayName={user?.nickname} email={user?.email} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>User</Menu.Label>
        <Menu.Item disabled leftSection={<IconUser width={iconWidth} />}>
          {user?.nickname}
        </Menu.Item>
        <Menu.Item disabled leftSection={<IconMail width={iconWidth} />}>
          {user?.email}
        </Menu.Item>

        <Menu.Label>Account Actions</Menu.Label>
        <Menu.Item leftSection={<IconLogout width={iconWidth} />} onClick={() => logout()}>
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
