import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const wallet = new PetraWallet(); // single wallet instance

// --- Header Component ---
function Header() {
  const { account, connect, disconnect, signAndSubmitTransaction } = useWallet();

  const handleCheckAndPay = async () => {
    if (!account) await connect(wallet);

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
        alert(`Paid! TX Hash: ${result.hash}`);
        console.log(result);
      } else {
        alert("Backend says no payment required.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">GitHub Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>{account ? `Wallet: ${account.address}` : "Not connected"}</span>
        <button
          onClick={handleCheckAndPay}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {account ? "Check & Pay" : "Connect Wallet"}
        </button>
        {account && (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Disconnect
          </button>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}

// --- Main App ---
function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="min-h-screen bg-gray-50">
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen">
            <div className="p-8 shadow-md bg-white rounded-lg text-center space-y-4">
              <h1 className="text-2xl font-bold">GitHub Dashboard</h1>
              <p className="text-gray-600">Sign in with GitHub to continue</p>
              <SignIn
                routing="virtual"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none border-0",
                  },
                }}
              />
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <Header />
          <div className="p-6">
            <Dashboard />
          </div>
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}

export default App;
