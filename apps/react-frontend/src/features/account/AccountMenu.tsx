import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from "@mantine/core";
import { AccountButton } from "./AccountButton";

export default function AccountMenu() {
  const { user } = useAuth0();

  return (
    <Menu shadow="md">
      <Menu.Target>
        <AccountButton image={user?.picture} displayName={user?.nickname} email={user?.email} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>User</Menu.Label>
        <Menu.Item>{user?.name}</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
