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

@inject('trade')
@observer
class TradeDialog extends Component {
  get isOpen() {
    return !!this.props.trade.ticket;
  }

  onSave = () => {
    this.props.trade.save();
  };

  handleClose = () => {
    this.props.trade.setTicket(null);
  };

  onFieldChange = ({target}) => {
    const {value, name} = target;
    this.props.trade.setValue(name, value);
  };

  render() {
    const {type, amount, timeOpen, timeClose, priceOpen, priceClose, stopLoss, volume, stopLossVolume, profit} = this.props.trade;
    const {symbol, priceStep, priceStepCost, go} = this.props.trade.symbol;

    return (
      <Dialog
        open={this.isOpen}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Trade
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
                  value={go}
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
                  value={amount}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Open Price"
                  inputProps={{name: 'priceOpen'}}
                  type="number"
                  value={priceOpen}
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
                  value={stopLoss}
                  onChange={this.onFieldChange}
                />
              </div>
              <div>
                <TextField
                  label="Close Price"
                  inputProps={{name: 'priceClose'}}
                  type="number"
                  value={priceClose}
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
                value={volume}
                type="number"
                disabled
              />
            </div>
            <div>
              <TextField
                label="SL Volume"
                value={stopLossVolume}
                type="number"
                disabled
              />
            </div>
            <div>
              <TextField
                label="Profit"
                value={profit}
                type="number"
                disabled
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
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