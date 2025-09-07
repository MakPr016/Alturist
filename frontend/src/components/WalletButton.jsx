import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function WalletButton() {
  const { account, connect, disconnect, signAndSubmitTransaction } = useWallet();

  const handleConnect = async () => {
    if (!account) await connect("Petra");
  };

  const handleSend = async () => {
    if (!account) await connect("Petra");

    const tx = {
      type: "entry_function_payload",
      function: "0x1::aptos_account::transfer",
      type_arguments: [],
      arguments: [
        "0xfcd724e4557c582d5e7d18314339dbc834d7344f182332805ba0f9ca0f3aa31f",
        "1000000",
      ],
    };

    try {
      const result = await signAndSubmitTransaction(tx);
      alert(`TX Hash: ${result.hash}`);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-2">
      <span>{account ? `Wallet: ${account.address}` : "Not connected"}</span>
      <button onClick={handleConnect} className="bg-blue-600 text-white px-3 py-1 rounded">
        Connect Wallet
      </button>
      {account && (
        <>
          <button onClick={handleSend} className="bg-green-600 text-white px-3 py-1 rounded">
            Send 0.01 APT
          </button>
          <button onClick={disconnect} className="bg-red-600 text-white px-3 py-1 rounded">
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
