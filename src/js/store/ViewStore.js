import {observable, action} from 'mobx';

class ViewStore {
  @observable currentView = '';

  @action setView = view => {
    this.currentView = view;
  }
}

export default ViewStore;