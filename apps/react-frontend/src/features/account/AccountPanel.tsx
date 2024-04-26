import { Button, Stack } from "@mantine/core";
import styles from "./AccountPanel.module.css";

export default function AccountPanel() {
  return (
    <div className={styles.container}>
      <Stack className={styles.panelButton}>
        <Button>Login</Button>
      </Stack>
    </div>
  );
}
