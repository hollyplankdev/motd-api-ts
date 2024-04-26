import { useAuth0 } from "@auth0/auth0-react";
import { Group, Loader } from "@mantine/core";
import AccountMenu from "./AccountMenu";
import styles from "./AccountPanel.module.css";
import LoginButton from "./LoginButton";

export default function AccountPanel() {
  const { isAuthenticated, isLoading } = useAuth0();

  const getState = () => {
    if (isLoading) return "loading";
    if (isAuthenticated) return "loggedIn";
    return "loggedOut";
  };
  const currentState = getState();

  const getPanelContents = (state: ReturnType<typeof getState>) => {
    switch (state) {
      case "loggedIn":
        return <AccountMenu />;
      case "loggedOut":
        return <LoginButton />;
      case "loading":
      default:
        return <Loader />;
    }
  };

  return (
    <div className={styles.container}>
      <Group justify="flex-end" className={styles.panelButton}>
        {getPanelContents(currentState)}
      </Group>
    </div>
  );
}
