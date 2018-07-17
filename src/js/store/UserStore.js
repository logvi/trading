import {observable, action, autorun} from 'mobx';
import api from '../api';

class UserStore {
  token = sessionStorage.getItem('token');
  @observable username = '';

  constructor(rootStore) {
    this.rootStore = rootStore;

    api.onAuthenticated((data) => {
      this.setUsername(data.username);
    });

    autorun(() => {
      if (!this.loggedIn) {
        this.rootStore.router.goTo('login');
      } else {
        this.rootStore.router.goTo('admin');
      }
    });
  }

  get loggedIn() {
    return Boolean(this.username);
  }

  @action login = (username, password) => {
    api.login({username, password}).then(res => {
      sessionStorage.setItem('token', res.token);
      this.setUsername(username);
    });
  };

  @action logout = () => {
    this.username = '';
    api.disconnect();
    sessionStorage.removeItem('token');
  };

  @action setUsername = value => {
    this.username = value;
  };
}

export default UserStore;