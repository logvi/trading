import React from 'react';

// material components
import Button from '@material-ui/core/Button';

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
      <Button
        onClick={this.login}
        color="primary"
        variant="raised"
      >
        Login
      </Button>
    );
  }

  render = () =>
    <div className="login-form" style={{marginTop: 20}}>
      <div style={{marginTop: 20}}>
        {this.renderForm()}
      </div>
    </div>;
}

export default LoginForm;