import './App.css';
import { useState, useEffect } from 'react'

const getAccount = () => 
  window.ethereum.request({ method: 'eth_accounts' })
  .catch((err) => {
    console.error(err);
  });

function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    getAccount().then(accs => {
      if (accs.length) {
        setAccount(accs[0])
      }
    })
  }, [])
  return (
    <div className="App">
      {account ? <div>{account}</div> : <button>connect</button>}
    </div>
  );
}

export default App;
