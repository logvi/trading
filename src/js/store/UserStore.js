import {observable, action, autorun} from 'mobx';
import setLoading from '../utils/setLoading';
import api from '../api';

class UserStore {
  @observable token = sessionStorage.getItem('token');
  @observable username = '';

  constructor(rootStore) {
    this.rootStore = rootStore;

    api.onAuthenticated((data) => {
      this.setUsername(data.username);
    });

    autorun(() => {
      if (this.token) {
        sessionStorage.setItem('token', this.token);
      } else {
        sessionStorage.removeItem('token');
      }
    })
  }

  get loggedIn() {
    return Boolean(this.token);
  }

  @action login = (username, password) => {
    setLoading('logging in...');
    api.login({username, password}).then(res => {
      if (!res.token) return;
        this.setToken(res.token);
        this.setUsername(username);
        this.rootStore.router.goTo('admin');
    });
  };

  @action logout = () => {
    setLoading('logging out...');
    this.setToken(null);
    api.setToken(null);
    this.rootStore.router.goTo('login');
  };

  @action setUsername = value => {
    this.username = value;
  };

  @action setToken = value => {
    this.token = value;
  }
}

export default UserStore;