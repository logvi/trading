import React from 'react';
import {inject, observer} from 'mobx-react';
// material components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

@inject('user')
@observer
class LoginForm extends React.Component {
  login = () => {
    this.props.user.login();
  };

  logout = () => {
    this.props.user.logout();
  };

  renderForm() {
    if (this.props.user.username) {
      return (
        <div style={{textAlign: 'center'}}>
          <div>{this.props.user.username}</div>
          <div style={{marginTop: 20}}>
            <RaisedButton label="Logout" onClick={this.logout} primary />
          </div>
        </div>
      );
    }
    return (
      <form>
        <TextField
          label="Username"
        />
        <TextField
          label="Password"
          type="password"
        />
        <Button
          onClick={this.login}
          color="primary"
          variant="raised"
        >
          Login
        </Button>
      </form>
    );
  }

  render = () =>
    <div className="login-form" style={{marginTop: 20}}>
      <div>
        {this.renderForm()}
      </div>
    </div>;
}

export default LoginForm;