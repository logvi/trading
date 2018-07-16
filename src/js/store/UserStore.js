import {observable, action, autorun} from 'mobx';
import api from '../api';

class UserStore {
  @observable username = '';

  constructor(rootStore) {
    this.rootStore = rootStore;

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

  @action login = () => {
    this.username = 'Vitalik';
  };

  @action logout = () => {
    this.username = '';
  };
}

export default UserStore;