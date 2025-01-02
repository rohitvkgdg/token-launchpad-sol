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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-gray-900">
        <ConnectionProvider endpoint="https://api.devnet.solana.com">
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <div className="flex flex-row itens-center m-10 content-start">
                <div className="flex w-full m-4 justify-evenly">
                  <WalletMultiButton />
                  <WalletDisconnectButton />
                </div>
                <div className="flex w-1/10 justify-end">
                  <ModeToggle />
                </div>
              </div>
              <TokenLaunchpad />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
