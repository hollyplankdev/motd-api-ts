import { useAuth0 } from "@auth0/auth0-react";
import { GlassButton } from "../glass/GlassButton";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <GlassButton size="md" onClick={() => loginWithRedirect()}>
      Log In
    </GlassButton>
  );
}
