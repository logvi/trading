import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import UserMenu from './UserMenu';
// material
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class HeaderBar extends React.Component {
  static propTypes = {
  };

  toggleMenu = () => {
    // this.props.menuStore.toggleMenu();
  };

  render() {
    const {classes} = this.props;
    const title = `Trading`;

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            {title}
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(observer(HeaderBar));