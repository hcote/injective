import { magic } from "./magic";
import { useEffect, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [publicAddress, setPublicAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    magic.user.isLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        magic.user.getInfo().then((metadata: any) => {
          setIsLoading(false);
          console.log("metadata", metadata);
          setPublicAddress(metadata.publicAddress);
        });
      } else {
        console.log("user not logged in");
        setIsLoading(false);
      }
    });
  }, []);

  const getCosmosAddress = async () => {
    magic.cosmos.changeAddress("cosmos").then((newAddress) => {
      console.log('newAddress', newAddress);
    }).catch((error: any) => {
      console.log("Error", error);
    });
  }

  const login = async () => {
    await magic.auth.loginWithEmailOTP({ email });
    const metadata = await magic.user.getInfo();
    console.log("metadata", metadata);
    setPublicAddress(metadata.publicAddress as string);
  };

  const sendTx = async () => {
    try {
      const message = [
        {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: publicAddress,
            toAddress: publicAddress,
            amount: [
              {
                denom: "inj",
                amount: "1",
              },
            ],
          },
        },
      ];

      const fee = {
        amount: [{ denom: "inj", amount: "32000000000000" }],
        gas: "200000",
      };
      const res = await magic.cosmos.signAndBroadcast(message, fee);
      console.log("res", res);
    } catch (error) {
      console.log("Error", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {publicAddress ? (
        <div>
          <p>{publicAddress}</p>
          <button onClick={sendTx}>Send Tx</button>
          <button onClick={getCosmosAddress}>Get cosmos address</button>
          <button onClick={() => magic.user.logout()}>logout</button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}
