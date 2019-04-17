import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Memes extends Component {

  render() {
    return (
        <h1>Memes</h1>
    );
  }
}

Memes.propTypes = {
  match: PropTypes.object,
};

export default Memes;
