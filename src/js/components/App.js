import React from 'react';
import Header from './Header';
import TradesCard from './TradesCard';
import TradeModal from './Modals/TradeModal';

function App() {
  return (
    <div className="app-container">
      <Header/>
      <div className="page-content">
        <div className="cards">
          <TradesCard />
        </div>
      </div>
      <TradeModal />
    </div>
  )
}

export default App;