import { Text } from "@mantine/core";
import { MessageOfTheDay } from "@motd-ts/models";

export default function MotdDisplay() {
  const motd: MessageOfTheDay = {
    _id: "??",
    message: "This is a message",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <>
      <Text size="xl" fw={700}>
        &quot;{motd.message}&quot;
      </Text>
      <span>
        <Text size="xs">Said on {motd.createdAt.toDateString()}</Text>
        <Text size="xs">Revised on {motd.updatedAt.toDateString()}</Text>
      </span>
    </>
  );
}
