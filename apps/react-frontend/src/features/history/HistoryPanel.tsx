import { Button, Drawer, Group, Modal, Paper, Stack, alpha } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllMotdHistory } from "../../api/motd";
import { MotdDisplay } from "../motd/MotdDisplay";
import { NewMotdForm } from "../motd/NewMotdForm";
import styles from "./HistoryPanel.module.css";

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
        <Stack gap="xs">
          <Paper shadow="lg" radius="md" style={{ padding: "10px" }}>
            <Group justify="end">
              <Button onClick={openCreateNew}>Create New</Button>
            </Group>
          </Paper>
          {query.data.map((motd) => (
            <MotdDisplay key={motd._id} motd={motd} loadState="done" isEditable size="small" />
          ))}
        </Stack>
      </Drawer>

      <Modal title="Write a Message of the Day" opened={isCreateNewOpen} onClose={closeCreateNew}>
        <NewMotdForm onComplete={closeCreateNew} />
      </Modal>

      <Stack className={styles.panelButton}>
        <Button
          onClick={openHistory}
          style={{
            backgroundColor: alpha("#001033", 0.5),
            backdropFilter: "blur(2px)",
          }}
        >
          History
        </Button>
      </Stack>
    </div>
  );
}
