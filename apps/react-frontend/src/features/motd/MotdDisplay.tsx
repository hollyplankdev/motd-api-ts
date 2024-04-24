import { ActionIcon, Blockquote, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MessageOfTheDay } from "@motd-ts/models";
import { IconAdjustments, IconError404, IconLoader, IconQuote } from "@tabler/icons-react";
import { EditMotdForm } from "./EditMotdForm";
import styles from "./MotdDisplay.module.css";

export interface MotdDisplayProps {
  /**
   * The actual message of the day that this will display. If none is provided, we assume that it's
   * loading still.
   */
  motd?: MessageOfTheDay;

  /**
   * If the difference between a MOTD's `createdAt` and `updatedAt` fields are larger than THIS
   * VALUE (in seconds), this component will cite the update.
   */
  timeBeforeCiteUpdate?: number;

  /** How loaded is this display? */
  loadState: "done" | "loading" | "error";

  /** OPTIONAL - the message to show when there is an error. */
  errorMessage?: string;

  /** Can this MOTD be edited? */
  isEditable?: boolean;
}

export function MotdDisplay(args: MotdDisplayProps) {
  // Unpack properties and apply defaults
  const { motd, timeBeforeCiteUpdate, loadState, errorMessage, isEditable } = {
    timeBeforeCiteUpdate: 60,
    isEditable: false,
    ...args,
  };

  // Create text showing when this MOTD was posted
  let createdAtText: string = "";
  if (motd) {
    createdAtText += `From ${motd.createdAt.toLocaleDateString()}`;
    createdAtText += ` at ${motd.createdAt.toLocaleTimeString()}.`;
  }

  // Create text showing when this MOTD was edited
  let editedAtText: string = "";
  if (motd && motd.updatedAt.getTime() - motd.createdAt.getTime() > timeBeforeCiteUpdate) {
    editedAtText += ` Edited ${motd.updatedAt.toLocaleDateString()}`;
    editedAtText += ` at ${motd.updatedAt.toLocaleTimeString()}.`;
  }

  // Use the message of the MOTD to populate the quote contents
  let quoteText: string = "";
  if (motd) {
    quoteText = `"${motd.message}"`;
  } else if (loadState === "loading") {
    quoteText = `...`;
  } else {
    quoteText = errorMessage || "error";
  }

  // If we don't have a MOTD, make the icon look like it's loading
  let icon: JSX.Element;
  if (motd) {
    icon = <IconQuote />;
  } else if (loadState === "loading") {
    icon = <IconLoader />;
  } else {
    icon = <IconError404 />;
  }

  // Change the color of the quote depending on the loading state
  let color: string;
  if (loadState === "done") {
    color = "blue";
  } else if (loadState === "loading") {
    color = "gray";
  } else {
    color = "red";
  }

  // Setup logic for the editing modal
  const [isEditModalOpen, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  return (
    <div className={styles.motd}>
      <Blockquote icon={icon} radius="xl" color={color}>
        <Stack>
          <Text size="xl" fw={700}>
            {quoteText}
          </Text>
          <Group justify="space-between">
            <Text size="s" c="dimmed" fs="italic">
              {createdAtText}
            </Text>
            <Text size="xs" c="dimmed" fs="italic">
              {editedAtText}
            </Text>
          </Group>
          {isEditable ? (
            <Text size="xs" c="dimmed" fs="italic">
              {motd?._id}
            </Text>
          ) : undefined}
        </Stack>
      </Blockquote>

      {isEditable && loadState === "done" ? (
        <ActionIcon className={styles.editButton} onClick={openEditModal}>
          <IconAdjustments style={{ width: "70%" }} />
        </ActionIcon>
      ) : undefined}

      <Modal opened={isEditModalOpen} onClose={closeEditModal} title={`Edit MOTD "${motd?._id}"`}>
        <EditMotdForm motd={motd} onComplete={closeEditModal} />
      </Modal>
    </div>
  );
}
