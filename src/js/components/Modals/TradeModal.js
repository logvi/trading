import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

@inject('trade')
@observer
class TradeModal extends Component {
  get isOpen() {
    return !!this.props.trade.ticket;
  }

  handleClose = () => {
    this.props.trade.setTicket(null);
  };

  render() {
    return (
      <Dialog
        open={this.isOpen}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Trade
        </DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={this.props.trade.ticket}
            label="ticket"
            inputRef={el => this.ticketField = el}
          />
          <TextField
            defaultValue={this.props.trade.type}
            label="Type"
          />
          <TextField
            defaultValue={this.props.trade.openTime}
            label="Open Time"
          />
          <TextField
            defaultValue={this.props.trade.openPrice}
            label="Open Price"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Save
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default TradeModal;