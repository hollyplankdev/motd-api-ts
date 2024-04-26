import { useAuth0 } from "@auth0/auth0-react";
import { GlassButton } from "../glass/GlassButton";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <GlassButton size="md" onClick={() => logout()}>
      Log Out
    </GlassButton>
  );
}
