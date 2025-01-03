import { useState } from "react";
import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

const MAINNET_URL = import.meta.env.REACT_APP_MAINNET_URL;
const DEVNET_URL = import.meta.env.REACT_APP_DEVNET_URL;

if (!MAINNET_URL || !DEVNET_URL) {
  throw new Error('Invalid or missing RPC URLs in environment variables');
}

function App() {
  const [network, setNetwork] = useState<"mainnet" | "devnet">("mainnet");
  const endpoint = network === "mainnet" ? MAINNET_URL : DEVNET_URL;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-gray-900">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <div className="flex flex-row items-center m-10 content-start">
                <div className="flex w-full m-4 justify-evenly">
                  <WalletMultiButton />
                  <WalletDisconnectButton />
                </div>
                <div className="flex w-1/10 justify-end">
                  <ModeToggle />
                </div>
              </div>
              <TokenLaunchpad network={network} setNetwork={setNetwork} />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
