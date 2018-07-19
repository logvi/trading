import React from 'react';
import {inject, observer} from 'mobx-react';
// material components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

@inject('user')
@observer
class LoginForm extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    this.props.user.login(form.username.value, form.password.value);
  };

  logout = () => {
    this.props.user.logout();
  };

  renderForm() {
    if (this.props.user.loggedIn) {
      return (
        <div style={{textAlign: 'center'}}>
          <div>{this.props.user.username}</div>
          <div style={{marginTop: 20}}>
            <Button
              variant="raised"
              onClick={this.logout}
              color="primary"
            >
              Logout
            </Button>
          </div>
        </div>
      );
    }
    return (
      <form name="login" onSubmit={this.onSubmit}>
        <TextField
          label="Username"
          name="username"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
        />
        <Button
          color="primary"
          variant="raised"
          type="submit"
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