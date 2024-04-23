import { useQuery } from "@tanstack/react-query";
import { getLatestMotd } from "../../api/motd";
import { MotdDisplay } from "./MotdDisplay";

export default function LatestMotdDisplay() {
  const query = useQuery({ queryKey: ["getLatestMotd"], queryFn: getLatestMotd });

  return <MotdDisplay motd={query.data} />;
}
