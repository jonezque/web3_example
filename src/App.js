import "./App.css";
import { useState, useEffect } from "react";

const getAccount = () =>
  window.ethereum.request({ method: "eth_accounts" }).catch((err) => {
    console.error(err);
  });

const connect = async () =>
  window.ethereum.request({ method: "eth_requestAccounts" }).catch((err) => {
    if (err.code === 4001) {
      console.log("Please connect to MetaMask.");
    } else {
      console.error(err);
    }
  });

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    getAccount().then((accs) => {
      if (accs.length) {
        setAccount(accs[0]);
      }
    });
  }, []);

  useEffect(() => {
    const onAccountChanged = (accs) => {
      if (accs.length) {
        setAccount(accs[0]);
      } else {
        setAccount(null)
      }
    };
    window.ethereum.on("accountsChanged", onAccountChanged);
    return () => {
      window.ethereum.off("accountsChanged", onAccountChanged);
    };
  }, []);

  return (
    <div className="App">
      {account ? (
        <div>{account}</div>
      ) : (
        <button onClick={connect}>connect</button>
      )}
    </div>
  );
}

export default App;
