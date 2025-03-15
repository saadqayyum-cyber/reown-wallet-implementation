import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiAdapter, generalConfig, config } from "./config";
import { createAppKit } from "@reown/appkit";
import App from "./App";

const queryClient = new QueryClient();

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
