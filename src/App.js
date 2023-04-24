import "./App.css";
import { useState, useEffect } from "react";
import { ethers, formatUnits, Contract } from "ethers";
import abi from './erc20.abi.json'

const WEENUS = '0xaFF4481D10270F50f203E0763e2597776068CBc5'


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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    getAccount().then((accs) => {
      if (accs.length) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        provider.getSigner().then((signer) => setSigner(signer));
      }
    });
  }, []);

  return (
    <div className="App">
      {provider && signer ? (
        <Details provider={provider} signer={signer} />
      ) : (
        <button onClick={connect}>connect</button>
      )}
    </div>
  );
}

function Details({ provider, signer }) {
  const [balance, setBalance] = useState(-1);
  const [contract, setContract] = useState();
  const [weenusBalance, setWeenusBalance] = useState(-1)

  useEffect(() => {
    if (provider && signer) {
      provider.getBalance(signer.address).then(setBalance);

      setContract(new Contract(WEENUS, abi, provider))
    }
  }, [provider, signer]);

  useEffect(() => {
    if (contract) {
      contract.balanceOf(signer.address).then(setWeenusBalance)
    }
  }, [contract, signer?.address])

  return (
    <div>
      <div>account: {signer.address}</div>
      {balance !== -1 ? <div>ETH balance: {formatUnits(balance)}</div> : null}
      {weenusBalance !== -1 ? <div>WEENUS Balance: {formatUnits(weenusBalance)}</div> : null}
    </div>
  );
}

export default App;
