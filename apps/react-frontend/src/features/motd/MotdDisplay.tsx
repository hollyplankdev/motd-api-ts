import { ActionIcon, Blockquote, Button } from "@mantine/core";
import { MessageOfTheDay } from "@motd-ts/models";
import { IconAdjustments, IconError404, IconLoader, IconQuote } from "@tabler/icons-react";
import { Modal } from "@mantine/core";
import styles from "./MotdDisplay.module.css";
import { useDisclosure } from "@mantine/hooks";
import { EditMotdForm } from "./EditMotdForm";

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

  // Use the origin date of the MOTD as it's cite field.
  let citeText: string = "";
  if (motd) {
    citeText += `From ${motd.createdAt.toDateString()}.`;
    if (motd.updatedAt.getTime() - motd.createdAt.getTime() > timeBeforeCiteUpdate) {
      citeText += ` Revised on ${motd.updatedAt.toDateString()}.`;
    }

    // Show ID if editable
    if (isEditable) {
      citeText += `\n${motd._id}`;
    }
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
      <Blockquote icon={icon} cite={citeText} radius="xl" color={color}>
        {quoteText}
      </Blockquote>

      {isEditable && loadState === "done" ? (
        <ActionIcon className={styles.editButton} onClick={openEditModal}>
          <IconAdjustments style={{ width: "70%" }} />
        </ActionIcon>
      ) : undefined}

      <Modal opened={isEditModalOpen} onClose={closeEditModal} title={`Edit MOTD "${motd?._id}"`}>
        <EditMotdForm motd={motd} />
      </Modal>
    </div>
  );
}
