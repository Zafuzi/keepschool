import React from "react";
import Upload from '../components/Upload';
import '../components/styles/Home.css';
import Navigation from '../components/Navigation';

const appTokenKey = "appToken"; // also duplicated in Login.js
export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Navigation history={this.props.history}/>
                <center>
                  <h3>Upload images to save</h3>
                </center>
                <Upload />
            </div>
        );
    }
}
