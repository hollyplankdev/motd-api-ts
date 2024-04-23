import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <div className="App">
          <div className="AppContainer">
            <div className="CenterPanel">
              <h1>Hello World!</h1>
              <body>This is a test app...</body>
            </div>
          </div>
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
