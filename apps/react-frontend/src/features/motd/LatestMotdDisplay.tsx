import { useQuery } from "@tanstack/react-query";
import { getLatestMotd } from "../../api/motd";
import { MotdDisplay, MotdDisplayProps } from "./MotdDisplay";

export default function LatestMotdDisplay() {
  const query = useQuery({ queryKey: ["getLatestMotd"], queryFn: getLatestMotd });

  const getLoadStateFromQuery = (): MotdDisplayProps["loadState"] => {
    if (query.isError) return "error";
    if (query.isPending) return "loading";
    return "done";
  };

  return <MotdDisplay motd={query.data} loadState={getLoadStateFromQuery()} />;
}
