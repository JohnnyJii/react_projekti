import React, {Component} from 'react';
import PropTypes from 'prop-types';

class About extends Component {

  render() {
    return (
        <h1>About</h1>
    );
  }
}

About.propTypes = {
  match: PropTypes.object,
};

export default About;
