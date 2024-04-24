import { MessageOfTheDay } from "@motd-ts/models";

export interface EditMotdFormProps {
  /** OPTIONAL - The MOTD to populate this form with. */
  motd?: MessageOfTheDay;
}

export function EditMotdForm(args: EditMotdFormProps) {
  const { motd } = args;

  return <div>{JSON.stringify(motd)}</div>;
}
