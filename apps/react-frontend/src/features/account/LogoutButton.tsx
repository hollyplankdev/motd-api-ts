import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return <Button onClick={() => logout()}>Log Out</Button>;
}
