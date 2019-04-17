import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              News
            </Typography>
            <Button color="inherit" button component={Link} to="/home">Home</Button>
            {props.checkLogin() &&
                <React.Fragment>
                  <Button color="inherit" button component={Link} to="/upload">Upload</Button>
                  <Button color="inherit" button component={Link} to="/profile">Profile</Button>
                  <Button color="inherit" button component={Link} to="/logout">Logout</Button>
                </React.Fragment>
            }
            {!props.checkLogin() &&
              <React.Fragment>
                <Button color="inherit" button component={Link} to="/">Login</Button>
              </React.Fragment>
            }
          </Toolbar>
        </AppBar>
      </div>
  );
}

ButtonAppBar.propTypes = {
  checkLogin: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
