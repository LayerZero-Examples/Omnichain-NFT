import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from './components/Header';
import { useMoralis } from "react-moralis";
import { networks } from "./abis/OmniChainNFT.json";

function App() {
  // const [count, setCount] = useState(0)
  const { Moralis, chainId, account } = useMoralis();
  console.log(chainId)
  return (
    <>
      <Header />
      {networks.map(network => network.chainId).includes(chainId)
        ? (account ? <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/rentals" element={<Rentals />} /> */}
        </Routes> : <div className='mt-40 text-xl text-red-600 text-center'>Please connect with Metamask.</div>)
        : <div className='mt-40 text-xl text-red-600 text-center'>Please connect to Fuji or Rinkeby Network.</div>}
    </>
  )
}

export default App