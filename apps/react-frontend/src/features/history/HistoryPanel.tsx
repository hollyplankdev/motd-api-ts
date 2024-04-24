import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllMotdHistory } from "../../api/motd";
import { MotdDisplay } from "../motd/MotdDisplay";
import styles from "./HistoryPanel.module.css";

export default function HistoryPanel() {
  const [opened, { open, close }] = useDisclosure(false);
  const query = useQuery({
    queryKey: ["motd", "history"],
    queryFn: getAllMotdHistory,
    initialData: [],
  });

  return (
    <div className={styles.container}>
      <Drawer opened={opened} onClose={close} position="left" size="lg" title="MOTD History">
        {query.data.map((motd) => (
          <MotdDisplay key={motd._id} motd={motd} loadState="done" isEditable />
        ))}
      </Drawer>
      <Button className={styles.panelButton} onClick={open}>
        History
      </Button>
    </div>
  );
}
