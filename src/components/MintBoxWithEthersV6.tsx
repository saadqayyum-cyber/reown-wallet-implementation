import { useState } from "react";
import { abi } from "../abis/abi";
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import type { Provider } from "@reown/appkit/react";

function MintBoxWithEthersV6() {
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const contractAddress = "0xE075c408F7D697f086Ec7d5b515Ead64AdfbB438";

  const [logs, setLogs] = useState<{ message: string; isError: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string, isError = false) => {
    setLogs((prevLogs) => [...prevLogs, { message, isError }]);
  };

  const mint = async () => {
    try {
      setLoading(true);
      setLogs([]);
      addLog("Starting Mint process...");

      // Get signer from BrowserProvider
      addLog("Getting signer ...");
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const signerAddress = await signer.getAddress();
      addLog(`Using signer with address: ${signerAddress}`);

      addLog("Creating contract instance...");
      const contract = new Contract(contractAddress, abi, signer);

      // Execute the mint function
      const amount = parseUnits("1", 18); // Updated for Ethers v5
      addLog(`Minting to address: ${signerAddress}...`);
      const tx = await contract.mint(signerAddress, amount);

      addLog(`Transaction submitted: ${tx.hash}`);

      // Wait for confirmation
      addLog("Waiting for transaction confirmation...");
      // await tx.wait();
      addLog("Mint successful!");
    } catch (error) {
      console.error("Mint error:", error);
      addLog(`Mint failed: ${error}`, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-container">
      <button className="mint-button" onClick={mint}>
        Mint
      </button>

      <div className="logs-container">
        {loading && (
          <div className="loading-overlay">
            <span>Loading...</span>
          </div>
        )}
        <h4 className="logs-title">Logs:</h4>
        {logs.map((log, index) => (
          <div key={index} className={`log-entry ${log.isError ? "error" : ""}`}>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MintBoxWithEthersV6;
