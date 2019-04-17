import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {login, register, getUser, checkUser} from '../utils/MediaAPI';
import {TextField, Button} from '@material-ui/core';
import {Send} from '@material-ui/icons';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import red from '@material-ui/core/colors/red';

import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    width: '50%',
    padding: '1rem',
  },
  button: {
    margin: theme.spacing.unit,
  },
  alert: {
    color: red[500],
  },
});

class Login extends Component {
  state = {
    user: {
      username: '',
      password: '',
      email: '',
      full_name: '',
      repeatPassword: '',
    },
    message: '',
    formToggler: true,
    validUser: true,
  };

  myRef = 'form';

  handleLoginSubmit = (evt) => {
    evt.preventDefault();
    this.doLogin();
  };

  handleRegisterSubmit = () => {
    const user = {...this.state.user};
    // remove repeatPassword
    delete user.repeatPassword;
    register(user).then(user => {
      console.log(user);
      if (user.message !== undefined) {
        this.setState({message: user.message});
        return;
      }
      this.doLogin();
    });
  };

  doLogin = () => {
    login(this.state.user.username, this.state.user.password).then(response => {
      console.log(response);
      if (response.user !== undefined) {
        this.props.setUser(response.user);
        localStorage.setItem('token', response.token);
        this.props.history.push('/home');
      } else {
        this.setState({message: response.message});
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  handleInputChange = (evt) => {
    const target = evt.target;
    const value = target.value;
    const name = target.name;

    console.log(value, name);

    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,

      },
    }));

    if (name === 'username') {
      this.checkUsername(target.value);
    }
  };

  checkUsername = (username) => {
    checkUser(username).then((result) => {
      console.log(result.available);
      this.setState({validUser: result.available});
    });
  };

  toggleForm = () => {
    this.setState({formToggler: !this.state.formToggler});
  };

  componentDidMount() {
    console.log(localStorage.getItem('token'));
    if (localStorage.getItem('token') !== null) {
      getUser(localStorage.getItem('token')).then(response => {
        this.props.setUser(response);
        this.props.history.push('/home');
      });
    }
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return value === this.state.user.password;
    });
    ValidatorForm.addValidationRule('isUserAvailable', () => {
      return this.state.validUser;
    });
  }

  render() {
    const {classes} = this.props;
    return (
        <div className={classes.container}>
          <div>
            <Button color="primary" variant="contained"
                    onClick={this.toggleForm}>{(this.state.formToggler && `No account yet?
              Register.`) || `Login`}</Button>
          </div>
          {this.state.formToggler &&
          <React.Fragment>
            <h1>Login</h1>
            <form onSubmit={this.handleLoginSubmit}>
              <TextField fullWidth required name="username" id="username"
                         label="Username"
                         value={this.state.user.username}
                         onChange={this.handleInputChange}/>
              <TextField fullWidth required name="password" type="password"
                         id="password"
                         label="Password"
                         value={this.state.user.password}
                         onChange={this.handleInputChange}/>
              <Button className={classes.button} variant="contained"
                      color="primary" type="submit">
                <Send/>&nbsp;Login
              </Button>
            </form>
          </React.Fragment>
          }

          {!this.state.formToggler &&
          <React.Fragment>
            <h1>Register</h1>
            <ValidatorForm instantValidate={false} onSubmit={this.handleRegisterSubmit}
                           onError={errors => console.log(errors)}>
              <TextValidator fullWidth name="username" id="username"
                             label="Username"
                             value={this.state.user.username}
                             onChange={this.handleInputChange}
                             validators={[
                               'required',
                               'minStringLength:3',
                               'isUserAvailable']}
                             errorMessages={[
                               'this field is required',
                               'minimum 3 charaters',
                               'username not available']}/>
              <TextValidator fullWidth name="password" type="password"
                             id="password"
                             label="Password"
                             value={this.state.user.password}
                             onChange={this.handleInputChange}
                             validators={['required', 'minStringLength:5']}
                             errorMessages={[
                               'this field is required',
                               'minimum 5 characters']}/>
              <TextValidator fullWidth name="repeatPassword" type="password"
                             id="repeatPassword"
                             label="Repeat password"
                             value={this.state.user.repeatPassword}
                             onChange={this.handleInputChange}
                             validators={['isPasswordMatch', 'required']}
                             errorMessages={[
                               'password mismatch',
                               'this field is required']}/>
              <TextValidator fullWidth name="email"
                             id="email"
                             label="email"
                             value={this.state.user.email}
                             onChange={this.handleInputChange}
                             validators={['required', 'isEmail']}
                             errorMessages={[
                               'this field is required',
                               'email is not valid']}/>
              <TextField fullWidth name="full_name" id="full_name"
                         label="Full name"
                         value={this.state.user.full_name}
                         onChange={this.handleInputChange}/>
              <Button className={classes.button} variant="contained"
                      color="primary" type="submit">
                <Send/>&nbsp;Register
              </Button>
            </ValidatorForm>
          </React.Fragment>
          }
          <p className={classes.alert}>
            {this.state.message}
          </p>
        </div>
    );
  }
}

Login.propTypes = {
  setUser: PropTypes.func,
  history: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styles)(Login);
