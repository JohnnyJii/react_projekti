import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {Button, CircularProgress, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/es/TextField/TextField';
import './css/Upload.css';
import {Slider} from '@material-ui/lab';


class Upload extends Component {
  mediaUrl = 'http://media.mw.metropolia.fi/wbma/';

  fr = new FileReader();

  componentDidMount() {
    this.fr.addEventListener('load', () => {
      this.setState((prevState) => ({
        ...prevState,
        imageData: this.fr.result,
      }));
    });
  }

  state = {
    file: {
      title: '',
      description: '',
      filedata: null,
      filename: undefined,
    },
    loading: false,
    imageData: null,
    filters: {
      brightness: 100,
      contrast: 100,
      warmth: 0,
      saturation: 100,
    },
    type: '',
  };

  handleFileChange = (evt) => {
    evt.persist();
    console.log(evt.target.files[0]);
    this.fr.readAsDataURL(evt.target.files[0]);
    this.setState((prevState) => ({
      ...prevState,
      type: evt.target.files[0].type,
      file: {
        ...prevState.file,
        filedata: evt.target.files[0],
      },
    }));
  };

  handleInputChange = (evt) => {
    const target = evt.target;
    const value = target.value;
    const name = target.name;

    console.log(value, name);

    this.setState((prevState) => ({
      file: {
        ...prevState.file,
        [name]: value,
      },
    }));
  };

  handleFileSubmit = (evt) => {
    console.log(evt);
    this.setState({loading: true});
    const fd = new FormData();
    fd.append('title', this.state.file.title);
    const description  = `[d]${this.state.file.description}[/d][f]${JSON.stringify(this.state.filters)}[/f]`
    fd.append('description', description);
    fd.append('file', this.state.file.filedata);

    const options = {
      method: 'POST',
      body: fd,
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    };

    fetch(this.mediaUrl + 'media', options).then(response => {
      return response.json();
    }).then(json => {
      console.log(json);
      setTimeout(() => {
        this.props.history.push('/home');
        this.props.updateImages();
        this.setState({loading: false});
      }, 2000);

    });
  };

  rangeReducer = (rawValue, props) => {
    console.log(rawValue);
    const {name} = props;
    const value = Math.round(rawValue);
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [name]: value,
      },
    }));
  };

  render() {
    return (
        <React.Fragment>
          <h1>Upload</h1>
          <ValidatorForm instantValidate={false}
                         onSubmit={this.handleFileSubmit}
                         onError={errors => console.log(errors)}>
            <TextValidator name="title" label="Title"
                           value={this.state.file.title}
                           onChange={this.handleInputChange}
                           validators={['required', 'minStringLength:3']}
                           errorMessages={[
                             'this field is required',
                             'minimum 3 charaters']}
                           fullWidth/>
            <TextValidator name="description" label="Description"
                           value={this.state.file.description}
                           onChange={this.handleInputChange}
                           validators={['required', 'minStringLength:3']}
                           errorMessages={[
                             'this field is required',
                             'minimum 3 charaters']}
                           fullWidth
                           multiline
                           rows={3}/>
            <TextField name="filedata" label="File"
                       value={this.state.file.filename}
                       type="file"
                       onChange={this.handleFileChange}
                       fullWidth/>
            <Button type="submit" variant="contained"
                    color="primary">Upload&nbsp;{this.state.loading &&
            <CircularProgress size={20}/>}</Button>
          </ValidatorForm>
          {this.state.imageData !== null && this.state.type.includes('image') &&
          <div><img src={this.state.imageData} alt="preview"
                    className={'preview'}
                    style={{filter: `brightness(${this.state.filters.brightness}%) contrast(${this.state.filters.contrast}%) sepia(${this.state.filters.warmth}%) saturate(${this.state.filters.saturation}%)`}}/>
            <div>
              <Typography id="brightness-label">Brightness: {this.state.filters.brightness}%</Typography>
              <Slider name="brightness" value={this.state.filters.brightness}
                      valueReducer={this.rangeReducer}
                      min={0}
                      max={200}
                      step={1}
                      aria-labelledby="brightness-label"/>
            </div>
            <div>
              <Typography id="contrast-label">Contrast: {this.state.filters.contrast}%</Typography>
              <Slider name="contrast" value={this.state.filters.contrast}
                      valueReducer={this.rangeReducer}
                      min={0}
                      max={200}
                      step={1}
                      aria-labelledby="contrast-label"/>
            </div>
            <div>
              <Typography id="saturation-label">Saturation: {this.state.filters.saturation}%</Typography>
              <Slider name="saturation" value={this.state.filters.saturation}
                      valueReducer={this.rangeReducer}
                      min={0}
                      max={200}
                      step={1}
                      aria-labelledby="saturation-label"/>
            </div>
            <div>
              <Typography id="warmth-label">Warmth: {this.state.filters.warmth}%</Typography>
              <Slider name="warmth" value={this.state.filters.warmth}
                      valueReducer={this.rangeReducer}
                      min={0}
                      max={100}
                      step={1}
                      aria-labelledby="warmth-label"/>
            </div>
          </div>
          }

        </React.Fragment>
    )
        ;
  }
}

Upload.propTypes = {
  history: PropTypes.object,
  updateImages: PropTypes.func,
};

export default Upload;
