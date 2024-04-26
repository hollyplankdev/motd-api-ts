import { useAuth0 } from "@auth0/auth0-react";
import { Button, Stack } from "@mantine/core";
import styles from "./AccountPanel.module.css";

export default function AccountPanel() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.container}>
      <Stack className={styles.panelButton}>
        <Button onClick={() => loginWithRedirect()}>Log In</Button>
      </Stack>
    </div>
  );
}
