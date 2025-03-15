import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, base } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "5d117eb344e3757d8a600d18a0923eaf";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Saad Reown Wagmi Project",
  description: "Saad Reown Wagmi Project",
  url: "https://reown.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [base, sepolia] as [AppKitNetwork, ...AppKitNetwork[]];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

export const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: "dark" as const,
  themeVariables: {
    "--w3m-accent": "#000000",
  },
};
