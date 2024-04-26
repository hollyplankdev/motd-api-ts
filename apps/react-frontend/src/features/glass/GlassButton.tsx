import { Button, ButtonProps, alpha, createPolymorphicComponent } from "@mantine/core";
import { forwardRef } from "react";
import theme from "../../theme";

export interface GlassButtonProps extends ButtonProps {}

export const GlassButton = createPolymorphicComponent<"button", GlassButtonProps>(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLButtonElement, GlassButtonProps>((props, ref) => (
    <Button
      ref={ref}
      bg={alpha("#FFFFFF", 0.5)}
      variant="filled"
      c="black"
      radius="md"
      style={{
        backdropFilter: "blur(4px)",
        boxShadow: theme.shadows?.md,
      }}
      {...props}
    />
  )),
);
GlassButton.displayName = "GlassButton";
