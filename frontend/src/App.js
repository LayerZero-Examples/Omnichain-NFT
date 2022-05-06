import logo from './logo.svg';
import './App.css';

import Home from "./pages/Home";
import Header from './components/Header';
import { useMoralis } from "react-moralis";
import { networks } from "./abis/OmniChainNFT.json";

function App() {
  const { chainId, account } = useMoralis();

  return (
    <>
      <Header />
      {networks.map(network => network.chainId).includes(chainId)
        ? (account ? <Home /> : <div className='mt-40 text-xl text-red-600 text-center'>Please connect with Metamask.</div>)
        : <div className='mt-40 text-xl text-red-600 text-center'>Please connect to Fuji or Rinkeby Network.</div>}
    </>
  );
}

export default App;
