import { Button, Drawer, Group, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllMotdHistory } from "../../api/motd";
import { MotdDisplay } from "../motd/MotdDisplay";
import styles from "./HistoryPanel.module.css";
import { NewMotdForm } from "../motd/NewMotdForm";

export default function HistoryPanel() {
  const [isHistoryOpen, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [isCreateNewOpen, { open: openCreateNew, close: closeCreateNew }] = useDisclosure(false);
  const query = useQuery({
    queryKey: ["motd", "history"],
    queryFn: getAllMotdHistory,
    initialData: [],
  });

  return (
    <div className={styles.container}>
      <Drawer
        opened={isHistoryOpen}
        onClose={closeHistory}
        position="left"
        size="lg"
        title="MOTD History"
      >
        <Stack>
          <Group justify="end">
            <Button onClick={openCreateNew}>Create New</Button>
          </Group>
          {query.data.map((motd) => (
            <MotdDisplay key={motd._id} motd={motd} loadState="done" isEditable />
          ))}
        </Stack>
      </Drawer>

      <Modal title="Write a Message of the Day" opened={isCreateNewOpen} onClose={closeCreateNew}>
        <NewMotdForm onComplete={closeCreateNew} />
      </Modal>

      <Stack className={styles.panelButton}>
        <Button onClick={openHistory}>History</Button>
      </Stack>
    </div>
  );
}
