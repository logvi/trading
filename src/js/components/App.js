import React from 'react';
import {inject, observer} from 'mobx-react';
import AdminView from './Views/AdminView';
import LoginView from "./Views/LoginView";

function App({view}) {
  switch (view.currentView) {
    case 'admin':
      return <AdminView />;
      break;
    case 'login':
      return <LoginView />;
      break;
    case '':
      return <div />;
      break;
  }
}

export default inject('view')(observer(App));