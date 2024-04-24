import { Button, Group, LoadingOverlay, Textarea } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMotd } from "../../api/motd";

interface FormValues {
  message: string;
}

export interface NewMotdFormProps {
  /** Called when the edited MOTD has been submitted. */
  onComplete?: Function;
}

export function NewMotdForm(args: NewMotdFormProps) {
  const { onComplete } = args;

  // Create the mutation function that will allow us to update the MOTD
  const queryClient = useQueryClient();
  const createMotdMutation = useMutation({
    mutationFn: (mutationArgs: { message: string }) => createMotd(mutationArgs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motd", "history"] });
      queryClient.invalidateQueries({ queryKey: ["motd", "latest"] });
    },
  });

  // Setup loading spinner for submitting
  const [isLoading, { open: showLoadingSpinner, close: hideLoadingSpinner }] = useDisclosure(false);

  // Setup the creation form
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: { message: "" },
    validate: {
      message: hasLength({ min: 1 }, "Must be at least 1 character"),
    },
  });

  // Setup what happens when the user submits the form
  const onFormSubmit = form.onSubmit(async () => {
    // Tell the API to update this message
    showLoadingSpinner();
    const { message } = form.getValues();
    const response = await createMotdMutation.mutateAsync({ message });
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
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={onFormSubmit}>
        <Textarea
          label="Message"
          placeholder="Enter a message of the day..."
          autosize
          {...form.getInputProps("message")}
        />

        <Group justify="end" mt="md">
          <Button type="submit">Create New</Button>
        </Group>
      </form>
    </div>
  );
}
