import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSingleMedia} from '../utils/MediaAPI';

class Single extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';
  state = {
    file: 'http://placekitten.com/200/200',
  };

  componentDidMount() {
    const {id} = this.props.match.params;
    getSingleMedia(id).then(pic => {
      console.log(pic);
      this.setState({file: pic});
    });
  }

  render() {
    return (
        <img src={this.mediaUrl + this.state.file.filename} alt={this.state.file.title}/>
    );
  }

}

Single.propTypes = {
  match: PropTypes.object,
};

export default Single;
