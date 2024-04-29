import { useAuth0 } from "@auth0/auth0-react";
import { Button, Group, LoadingOverlay, Textarea } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { MessageOfTheDay } from "@motd-ts/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMotd } from "../../api/motd";

interface FormValues {
  message: string;
}

export interface EditMotdFormProps {
  /** The MOTD to populate this form with. */
  motd?: MessageOfTheDay;

  /** Called when the edited MOTD has been submitted. */
  onComplete?: Function;
}

export function EditMotdForm(args: EditMotdFormProps) {
  const { motd, onComplete } = args;
  const { getAccessTokenSilently } = useAuth0();

  // Create the mutation function that will allow us to update the MOTD
  const queryClient = useQueryClient();
  const updateMotdMutation = useMutation({
    mutationFn: (mutationArgs: { id: string; newProps: { message?: string }; token: string }) =>
      updateMotd(mutationArgs.id, mutationArgs.newProps, { accessToken: mutationArgs.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motd", "history"] });
      queryClient.invalidateQueries({ queryKey: ["motd", "latest"] });
    },
  });

  // Setup loading spinner for submitting
  const [isLoading, { open: showLoadingSpinner, close: hideLoadingSpinner }] = useDisclosure(false);

  // Setup the edit form
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: { message: motd?.message || "" },
    validate: {
      message: hasLength({ min: 1 }, "Must be at least 1 character"),
    },
  });

  // Setup what happens when the user submits the form
  const onFormSubmit = form.onSubmit(async () => {
    // Tell the API to update this message
    showLoadingSpinner();
    const token = await getAccessTokenSilently();
    const { message } = form.getValues();
    const response = await updateMotdMutation.mutateAsync({
      id: motd!._id,
      newProps: { message },
      token,
    });
    hideLoadingSpinner();

    // If there was an error, tell us about it!
    if (!response) {
      form.setFieldError("message", "Failed to upload");
      return;
    }

    // OTHERWISE - we're done
    form.reset();
    if (onComplete) onComplete();
  });

  return (
    <div>
      <LoadingOverlay
        visible={isLoading || !motd}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={onFormSubmit}>
        <Textarea
          label="Message"
          placeholder="Enter a message of the day..."
          autosize
          {...form.getInputProps("message")}
        />

        <Group justify="end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </div>
  );
}
