import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  const { account, wallets, select, signAndSubmitTransaction } = useWallet();

  const handleCheckAndPay = async () => {
    if (!account) {
      const petra = wallets.find(w => w.name === "Petra");
      if (!petra) return alert("Petra wallet not installed");
      await select(petra.name); 
    }

    try {
      const res = await fetch("http://localhost:5000/shouldPay");
      const data = await res.json();

      if (data.pay) {
        const tx = {
          type: "entry_function_payload",
          function: "0x1::aptos_account::transfer",
          type_arguments: [],
          arguments: [
            "0xfcd724e4557c582d5e7d18314339dbc834d7344f182332805ba0f9ca0f3aa31f",
            "1000000",
          ],
        };
        const result = await signAndSubmitTransaction(tx);
        alert(`Paid! Tx Hash: ${result.hash}`);
      } else {
        alert("Backend says no payment required.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">GitHub Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>{account ? `Wallet: ${account.address}` : "Not connected"}</span>
        <button
          onClick={handleCheckAndPay}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          {account ? "Check & Pay" : "Connect Wallet"}
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
