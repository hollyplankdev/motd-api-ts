import { Paper, alpha } from "@mantine/core";
import { forwardRef } from "react";

export interface GlassPaperProps extends React.ComponentPropsWithoutRef<"div"> {}

export const GlassPaper = forwardRef<HTMLDivElement, GlassPaperProps>(
  (props: GlassPaperProps, ref) => (
    <Paper
      ref={ref}
      radius="md"
      shadow="lg"
      style={{
        backgroundColor: alpha("#FFFFFF", 0.5),
        backdropFilter: "blur(4px)",
      }}
      {...props}
    />
  ),
);
GlassPaper.displayName = "GlassPaper";
