import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import styles from "./HistoryPanel.module.css";

export default function HistoryPanel() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={styles.container}>
      <Drawer opened={opened} onClose={close} position="left" title="MOTD History">
        TODO - put stuff
      </Drawer>
      <Button className={styles.panelButton} onClick={open}>
        History
      </Button>
    </div>
  );
}
