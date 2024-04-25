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
    <MotdDisplay motd={query.data} loadState={loadState} errorMessage={query.error?.toString()} />
  );
}
