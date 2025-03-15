import { useState, useEffect } from "react";
import { abi } from "../abis/abi";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

function MintBoxWithWagmi() {
  const { address, isConnected } = useAppKitAccount();
  const contractAddress = "0xE075c408F7D697f086Ec7d5b515Ead64AdfbB438";

  const [logs, setLogs] = useState<{ message: string; isError: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [startedMint, setStartedMint] = useState(false);

  const addLog = (message: string, isError = false) => {
    setLogs((prevLogs) => [...prevLogs, { message, isError }]);
  };

  // Wagmi hooks for contract interaction
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    isError: isWriteError,
    isSuccess: isWriteSuccess,
    status: writeStatus,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Reset logs when starting a new mint
  const resetState = () => {
    setLogs([]);
    setLoading(true);
    setStartedMint(true);
    addLog("Starting Mint process...");
  };

  // Handle transaction stages
  useEffect(() => {
    if (isPending && startedMint) {
      addLog("Transaction pending. Please confirm in your wallet...");
    }
  }, [isPending, startedMint]);

  useEffect(() => {
    if (hash) {
      addLog(`Transaction submitted: ${hash}`);
    }
  }, [hash]);

  useEffect(() => {
    if (isConfirming) {
      addLog("Waiting for transaction confirmation on blockchain...");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      addLog("Mint successful!");
      setLoading(false);
      setStartedMint(false);
    }
  }, [isConfirmed]);

  // Handle user rejection or other errors
  useEffect(() => {
    if (isWriteError && writeError && startedMint) {
      const errorMessage = writeError.message || String(writeError);

      // Check for common wallet rejection error patterns
      if (
        errorMessage.includes("rejected") ||
        errorMessage.includes("denied") ||
        errorMessage.includes("cancelled") ||
        errorMessage.includes("canceled") ||
        errorMessage.includes("User denied") ||
        errorMessage.includes("user rejected")
      ) {
        addLog("Transaction rejected in wallet", true);
      } else {
        addLog(`Mint failed: ${errorMessage}`, true);
      }

      setLoading(false);
      setStartedMint(false);
      resetWrite();
    }
  }, [isWriteError, writeError, startedMint, resetWrite]);

  useEffect(() => {
    if (receiptError && startedMint) {
      addLog(`Transaction failed: ${receiptError.message}`, true);
      setLoading(false);
      setStartedMint(false);
    }
  }, [receiptError, startedMint]);

  // Add timeout for wallet response
  useEffect(() => {
    let timeoutId: number | undefined;

    if (startedMint && isPending) {
      // Set a timeout to detect if the user hasn't responded to the wallet prompt
      timeoutId = window.setTimeout(() => {
        if (startedMint && isPending && !hash && !isWriteError) {
          addLog("No response from wallet. Please check your wallet app or browser extension.", true);
          setLoading(false);
          // Keep startedMint true to allow the user to respond later
        }
      }, 30000); // 30 seconds timeout
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [startedMint, isPending, hash, isWriteError]);

  // Reset the mint state if the write contract operation status changes to "idle" after being "pending"
  useEffect(() => {
    if (startedMint && writeStatus === "idle" && !isWriteSuccess && !isWriteError) {
      // This likely means the user closed the wallet popup without confirming or rejecting
      addLog("Wallet interaction cancelled", true);
      setLoading(false);
      setStartedMint(false);
    }
  }, [writeStatus, startedMint, isWriteSuccess, isWriteError]);

  const mint = async () => {
    try {
      resetState();

      if (!address) {
        addLog("No wallet connected", true);
        setLoading(false);
        setStartedMint(false);
        return;
      }

      addLog(`Using signer with address: ${address}`);
      addLog("Preparing transaction...");
      addLog(`Minting to address: ${address}...`);
      addLog("Waiting for wallet approval...");

      writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "mint",
        args: [address, 1000000000000000000n], // 1 token with 18 decimals
      });
    } catch (error: any) {
      console.error("Mint error:", error);
      addLog(`Mint failed: ${error.message || String(error)}`, true);
      setLoading(false);
      setStartedMint(false);
    }
  };

  return (
    <div className="mint-container">
      <button className="mint-button" onClick={mint} disabled={!isConnected || loading}>
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

export default MintBoxWithWagmi;
