import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import EventDetail from './pages/EventDetail';
import EventRegistration from './pages/EventRegistration';
import Main from './pages/Main';

function App() {
  const [account, setAccount] = useState('');
  const [ticketEventBlockchain, setTicketEventBlockchain] = useState(null);
  const [tokenBlockchain, setTokenBlockchain] = useState(null);
  const [tokens, setTokens] = useState(0);

  const getBalance = async () => {
    const tokenAmount = await tokenBlockchain.methods.balanceOf(account).call();
    setTokens(tokenAmount);
  }

  return (
    <Router className="App">
      <Navbar
        account={account}
        setAccount={setAccount}
        tokens={tokens}
        setTicketEventBlockchain={setTicketEventBlockchain} />
      <Routes>
        <Route
          path="/eventregistration"
          element={
            <EventRegistration
              ticketEventBlockchain={ticketEventBlockchain}
              account={account}  />} />
        <Route
          path="/event/:id/:referLink/:referer"
          element={
            account
              ? <EventDetail
                  ticketEventBlockchain={ticketEventBlockchain}
                  getBalance={getBalance}
                  account={account} />
              : <div className="container pt-3"><h1>Connect to your wallet to see event</h1></div>
            } />
        <Route
          path="/event/:id/:referLink"
          element={
            account
              ? <EventDetail
                  ticketEventBlockchain={ticketEventBlockchain}
                  getBalance={getBalance}
                  account={account} />
              : <div className="container pt-3"><h1>Connect to your wallet to see event</h1></div>
            } />
        <Route
          path="/event/:id"
          element={
            account
              ? <EventDetail
                  ticketEventBlockchain={ticketEventBlockchain}
                  getBalance={getBalance}
                  account={account} />
              : <div className="container pt-3"><h1>Connect to your wallet to see event</h1></div>
            } />
        <Route
          path="/"
          element={<Main ticketEventBlockchain={ticketEventBlockchain} />}
          />
      </Routes>
    </Router>
  );
}

export default App;