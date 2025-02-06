import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Input } from "./ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface TokenLaunchpadProps {
  network: "mainnet" | "devnet";
  setNetwork: (network: "mainnet" | "devnet") => void;
}

export function TokenLaunchpad({ network, setNetwork }: TokenLaunchpadProps) {
  const wallet = useWallet();
  const { connection } = useConnection();

  const nameRef = useRef<HTMLInputElement>(null);
  const symbolRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const initialSupplyRef = useRef<HTMLInputElement>(null);

  async function createToken() {
    const name = nameRef.current?.value;
    const symbol = symbolRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;
    const initialSupply = initialSupplyRef.current?.value;

    if (!name || !symbol || !imageUrl || !initialSupply) {
      console.error("All fields are required");
      return;
    }

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keypair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey
          ? wallet.publicKey
          : new Keypair().publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keypair.publicKey,
        6,
        wallet.publicKey ? wallet.publicKey : new Keypair().publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID,
      ),
    );

    transaction.feePayer = wallet.publicKey
      ? wallet.publicKey
      : new Keypair().publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(keypair);
    const response = await wallet.sendTransaction(transaction, connection);
    console.log(response);
  }

  return (
    <div className="flex flex-col h-full w-full content-center items-center m-10">
      <div>
        <h1 className="text-5xl font-bold p-10">Solana Token Launchpad</h1>
      </div>
      <div className="grid grid-cols-1 w-1/5">
        <Tabs defaultValue="devnet" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
            <TabsTrigger value="devnet">Devnet</TabsTrigger>
          </TabsList>
          <TabsContent value={network} className="grid grid-cols-1 gap-5">
            <Input type="text" className="bg-transparent text-black" placeholder="Name" ref={nameRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Symbol" ref={symbolRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Image URL" ref={imageUrlRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Initial Supply" ref={initialSupplyRef} />
            <Button
              className="w-fit border place-self-center text-white bg-black dark:text-black dark:bg-white"
              variant="destructive"
              onClick={createToken}
            >
              CREATE TOKEN
            </Button>
          </TabsContent>
          <TabsContent value="devnet" className="grid grid-cols-1 gap-5">
            <Input type="text" className="bg-transparent text-black" placeholder="Name" ref={nameRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Symbol" ref={symbolRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Image URL" ref={imageUrlRef} />
            <Input type="text" className="bg-transparent text-black" placeholder="Initial Supply" ref={initialSupplyRef} />
            <Button
              className="w-fit border place-self-center text-white bg-black dark:text-black dark:bg-white"
              variant="destructive"
              onClick={createToken}
            >
              CREATE TOKEN
            </Button>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
