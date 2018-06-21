import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';

/**
 * Setting styles
 */
const theme = createMuiTheme({
  palette: {
    primary: { light: blue[300], main: blue[500], dark: blue[700] }
  }
});

export default theme;