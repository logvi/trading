import {observable, action} from 'mobx';

class ModalStore {
  @observable currentModal = '';

  @action openModal(name) {
    this.currentModal = name;
  }
}

export default ModalStore;