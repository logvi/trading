import React from 'react';
import Header from './Header';
import TradesCard from './TradesCard';
import Loader from './Loader';
import TradeDialog from './Dialogs/TradeDialog';

function App() {
  return (
    <div className="app-container">
      <Header/>
      <div className="page-content">
        <TradesCard />
      </div>
      <TradeDialog />
      <Loader/>
    </div>
  )
}

export default App;