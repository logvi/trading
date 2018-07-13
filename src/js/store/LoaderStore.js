import {observable, action} from 'mobx';

class LoaderStore {
  @observable visible = false;

  @action setVisible = state => {
    this.visible = state;
  }
}

export default LoaderStore;