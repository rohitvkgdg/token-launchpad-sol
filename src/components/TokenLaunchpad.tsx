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

export function TokenLaunchpad() {
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
      <div className="grid grid-cols-1 gap-2 w-1/4">
        <Input type="text" placeholder="Name" ref={nameRef} />
        <br />
        <Input
          type="text"
          placeholder="Symbol"
          ref={symbolRef}
          />
        <br />
        <Input
          type="text"
          placeholder="Image URL"
          ref={imageUrlRef}
          />
        <br />
        <Input
          type="text"
          placeholder="Initial Supply"
          ref={initialSupplyRef}
          />
        <br />
        <Button className="w-fit place-self-center" variant = "outline" onClick={createToken}>Create a token</Button>
      </div>
    </div>
  );
}
