import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

@inject('trade', 'trades')
@observer
class TradeDialog extends Component {
  get isOpen() {
    return Boolean(!!this.props.trade.data && this.props.trade.data._id);
  }

  onSave = () => {
    if (confirm('Do you really want to save the trade ' + this.props.trade.data.id)) {
      this.props.trade.save().then(() => {
        this.props.trades.refresh();
      });
    }
  };

  handleClose = () => {
    this.props.trade.setValue('_id', null);
  };

  onFieldChange = ({target}) => {
    const {value, name} = target;
    this.props.trade.setValue(name, value);
  };

  onDelete = () => {
    if (confirm('Do you really want to delete the trade ' + this.props.trade.data.id)) {
      this.props.trade.remove().then(() => {
        this.props.trades.refresh();
      });
    }
  };

  render() {
    if (!this.props.trade.data) return null;

    const {type, amount, timeOpen, timeClose, priceOpen, priceClose, stopLoss, volume, stopLossVolume, profit, id, _id} = this.props.trade.data;
    const {symbol, priceStep, priceStepCost, go} = this.props.trade.data.symbol;

    return (
      <Dialog
        open={this.isOpen}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Trade {id || id === 0 ? id : ''}
        </DialogTitle>
        <DialogContent className="trade-dialog">
          <div className="trade-dialog__fields">
            <div>
              <Typography variant="subheading">Symbol</Typography>
              <div>
                <TextField
                  label="Symbol"
                  value={symbol}
                  inputProps={{name: 'symbol'}}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Price Step"
                  type="number"
                  value={priceStep}
                  inputProps={{name: 'priceStep'}}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Cost of price step"
                  type="number"
                  value={priceStepCost}
                  inputProps={{name: 'priceStepCost'}}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="GO"
                  type="number"
                  value={go || ''}
                  inputProps={{name: 'go'}}
                  onChange={this.onFieldChange}
                />
              </div>
            </div>
            <div>
              <Typography variant="subheading">Trade</Typography>
              <div>
                <TextField
                  label="Type"
                  inputProps={{name: 'type'}}
                  select
                  value={type}
                  onChange={this.onFieldChange}
                >
                  <MenuItem value="BUY">BUY</MenuItem>
                  <MenuItem value="SELL">SELL</MenuItem>
                </TextField>
              </div>
              <div>
                <TextField
                  label="Amount"
                  inputProps={{name: 'amount'}}
                  type="number"
                  value={amount || 0}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Open Price"
                  inputProps={{name: 'priceOpen'}}
                  type="number"
                  value={priceOpen || 0}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  type="datetime-local"
                  label="Open Time"
                  inputProps={{name: 'timeOpen'}}
                  value={timeOpen}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="SL Price"
                  inputProps={{name: 'stopLoss'}}
                  type="number"
                  value={stopLoss || 0}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Close Price"
                  inputProps={{name: 'priceClose'}}
                  type="number"
                  value={priceClose || 0}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  type="datetime-local"
                  value={timeClose}
                  inputProps={{name: 'timeClose'}}
                  label="Close Time"
                  onChange={this.onFieldChange}
                />
              </div>
            </div>
          </div>
          <Typography variant="subheading">Totals</Typography>
          <div className="trade-dialog__totals">
            <div>
              <TextField
                label="Volume"
                value={volume || ''}
                type="number"
                disabled
              />
            </div>
            <div>
              <TextField
                label="SL Volume"
                value={stopLossVolume || ''}
                type="number"
                disabled
              />
            </div>
            <div>
              <TextField
                label="Profit"
                value={profit || ''}
                type="number"
                disabled
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {_id !== 'new' ?
            <Button onClick={this.onDelete} color="primary">
              Delete
            </Button>
          : null}
          <Button onClick={this.onSave} color="primary">
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

export default TradeDialog;