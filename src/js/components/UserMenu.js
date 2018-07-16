import React, {Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class UserMenu extends Component {
  state = {
    userMenuAnchorEl: null
  };

  logout = () => {
    this.props.userStore.logout();
    this.closeUserMenu();
  };

  openUserMenu = event => {
    this.setState({ userMenuAnchorEl: event.currentTarget });
  };

  closeUserMenu = () => {
    this.setState({ userMenuAnchorEl: null });
  };

  render() {
    const {userMenuAnchorEl} = this.state;
    const userMenuOpen = Boolean(userMenuAnchorEl);

    return (
      <div>
        <IconButton
          aria-haspopup="true"
          onClick={this.openUserMenu}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={userMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={userMenuOpen}
          onClose={this.closeUserMenu}
        >
          <MenuItem onClick={this.logout}>Sign out</MenuItem>
        </Menu>
      </div>
    )
  }
}

export default UserMenu;