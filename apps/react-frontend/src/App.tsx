import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import LatestMotdDisplay from "./features/motd/LatestMotdDisplay";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
          <div className="App">
            <div className="AppContainer">
              <div className="CenterPanel">
                <LatestMotdDisplay />
              </div>
            </div>
          </div>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
