import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import App from './components/App';
import setLoading from './utils/setLoading';
import Store from './store';
import {Provider} from 'mobx-react';

const store = new Store();
setLoading(false);
ReactDOM.render((
  <MuiThemeProvider theme={theme}>
    <Provider trades={store.trades} modal={store.modal} trade={store.trade} symbols={store.symbols}>
      <App />
    </Provider>
  </MuiThemeProvider>
), document.getElementById('app'));