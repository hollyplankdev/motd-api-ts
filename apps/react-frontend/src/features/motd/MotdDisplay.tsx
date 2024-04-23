import { Blockquote } from "@mantine/core";
import { MessageOfTheDay } from "@motd-ts/models";
import { IconQuote } from "@tabler/icons-react";

/**
 * If the difference between a MOTD's `createdAt` and `updatedAt` fields are larger than THIS VALUE
 * (in seconds), this component will cite the update.
 */
const timeBeforeCiteUpdate: number = 60;

export default function MotdDisplay() {
  const motd: MessageOfTheDay = {
    _id: "??",
    message: "Lorem ipsum may be used as a message.",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let citeText: string = `From ${motd.createdAt.toDateString()}.`;
  if (motd.updatedAt.getTime() - motd.createdAt.getTime() > timeBeforeCiteUpdate) {
    citeText += ` Revised on ${motd.updatedAt.toDateString()}.`;
  }

  const icon = <IconQuote />;

  return (
    <>
      <Blockquote icon={icon} cite={citeText} radius={"xl"}>
        &quot;{motd.message}&quot;
      </Blockquote>
      {/* <Text size="xl" fw={700}>
        &quot;{motd.message}&quot;
      </Text>
      <span>
        <Text size="xs">Said on {motd.createdAt.toDateString()}</Text>
        <Text size="xs">Revised on {motd.updatedAt.toDateString()}</Text>
      </span> */}
    </>
  );
}
