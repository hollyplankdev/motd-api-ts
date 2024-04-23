import { Blockquote } from "@mantine/core";
import { MessageOfTheDay } from "@motd-ts/models";
import { IconLoader, IconQuote } from "@tabler/icons-react";

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
}

export function MotdDisplay(args: MotdDisplayProps) {
  // Unpack properties and apply defaults
  const { motd, timeBeforeCiteUpdate } = { timeBeforeCiteUpdate: 60, ...args };

  // Use the origin date of the MOTD as it's cite field.
  let citeText: string = "";
  if (motd) {
    citeText += `From ${motd.createdAt.toDateString()}.`;
    if (motd.updatedAt.getTime() - motd.createdAt.getTime() > timeBeforeCiteUpdate) {
      citeText += ` Revised on ${motd.updatedAt.toDateString()}.`;
    }
  }

  // Use the message of the MOTD to populate the quote contents
  let quoteText: string = "";
  if (motd) {
    quoteText = `"${motd.message}"`;
  } else {
    quoteText = "...";
  }

  // If we don't have a MOTD, make the icon look like it's loading
  let icon: JSX.Element;
  if (motd) {
    icon = <IconQuote />;
  } else {
    icon = <IconLoader />;
  }

  return (
    <Blockquote icon={icon} cite={citeText} radius="xl">
      {quoteText}
    </Blockquote>
  );
}
