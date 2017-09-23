import React from 'react';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import { Card, CardMedia, CardTitle, CardActions, RaisedButton } from 'material-ui';
import InlineEdit from 'react-edit-inline';
import Modal from 'react-modal';

import './styles/Upload.css';

class Upload extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      avatar: '',
      isUploading: false,
      progress: 0,
      avatarURL: '',
      images: [],
      filename: '',
      expandedIndex: null
    };

    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleExpandedImage = this.handleExpandedImage.bind(this);
  }

  componentDidMount() {
    console.log(this.state.user.uid);
    const images = firebase.database().ref('user-data').child(this.state.user.uid).child('images');
    images.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      console.log(items);
      for (let item in items) {
        newState.push({
          id: item,
          filename: items[item].image.filename,
          url: items[item].image.url
        });
      }
      this.setState({
        images: newState
      });
    });
  }
  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({avatar: filename, progress: 100, isUploading: false});
    firebase.storage().ref('images').child(filename).getDownloadURL()
    .then(url => {
      this.setState({avatarURL: url});
      const itemsRef = firebase.database().ref('user-data').child(this.state.user.uid).child('images');
      const item = {
        image: {
          filename: filename,
          url: url
        }
      }
      itemsRef.push(item);
    });
  };
  handleExpandedImage = (index) => {
    this.setState({expandedIndex: index});
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/user-data/${this.state.user.uid}/images/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <div id="upload_form">
        <form>
          <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, margin:10, cursor: 'pointer'}}>
            Add Images
            <FileUploader
              hidden
              accept="image/*"
              multiple
              //filename={file => this.state.filename + file.name.split('.')[1] }
              storageRef={firebase.storage().ref('images')}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
          </label>
        </form>
        <ul className="wrapper">
            {this.state.images.map((image, index) => {
              return(
                <li className="file_card" key={image.id}>
                  <ExpandableImage url={image.url} index={index}/>
                  <h4>{image.filename}</h4>
                  <button style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, margin:10, cursor: 'pointer', border: 'none'}}
                          onClick={() => this.removeItem(image.id)} >DELETE</button>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

class ExpandableImage extends React.Component {
  constructor(props){
    super(props);
    this.state = {isExpanded: false};
    this.handleExpandedImage = this.handleExpandedImage.bind(this);
  }
  handleExpandedImage = () => this.setState({isExpanded: !this.state.isExpanded});
  render(props){
    const ModalStyle = {
      overlay: {
        background: 'rgba(0,0,0,.38)'
      },
      content: {
        maxWidth: '600px',
        width: '95vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        margin: '0 auto',
        padding: 0,
        left: 0,
        right: 0
      }
    }
    return(
      <div className="image_container">
        <img src={this.props.url} onClick={this.handleExpandedImage} />
        <Modal isOpen={this.state.isExpanded}
          closeTimeoutMS={0}
          style={ModalStyle}
          contentLabel="Modal"
          onClick={this.handleExpandedImage}>
          <img style={{width: '100%', height: 'auto', display: 'flex', objectFit: 'contain', cursor: 'pointer', zIndex:'99'}} src={this.props.url} onClick={this.handleExpandedImage} />
        </Modal>
      </div>
    );
  }
}

export default Upload;
