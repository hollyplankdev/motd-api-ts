import { LoadingOverlay, Stack, Transition } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getLatestMotd } from "../../api/motd";
import { MotdDisplay, MotdDisplayProps } from "./MotdDisplay";

export default function LatestMotdDisplay() {
  const query = useQuery({ queryKey: ["motd", "latest"], queryFn: getLatestMotd });

  // Distill the load state from the query's ACTUAL loading state
  let loadState: MotdDisplayProps["loadState"];
  if (query.isError) {
    loadState = "error";
  } else if (query.isPending) {
    loadState = "loading";
  } else {
    loadState = "done";
  }

  return (
    <>
      <LoadingOverlay visible={loadState === "loading"} />
      <Transition mounted={loadState !== "loading"} transition="fade-up" duration={500}>
        {(styles) => (
          <Stack maw={1000} style={{ margin: "50px", ...styles }}>
            <MotdDisplay
              motd={query.data}
              loadState={loadState}
              errorMessage={query.error?.toString()}
            />
          </Stack>
        )}
      </Transition>
    </>
  );
}
