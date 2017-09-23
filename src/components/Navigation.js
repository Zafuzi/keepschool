import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Avatar, RaisedButton, FlatButton} from "material-ui";
import ConfirmLink from 'react-confirm-dialog';
import {logout} from "../helpers/auth";

const appTokenKey = "appToken";
export default class Navigation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        firebaseUser: JSON.parse(localStorage.getItem("user"))
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(args) {
      if(! args.a + args.b === 3) return;
      logout().then(function () {
          localStorage.removeItem(appTokenKey);
          this.props.history.push("/login");
          console.log("user signed out from firebase");
      }.bind(this));
  }
  render(){
    if(appTokenKey){}
    return(
      <AppBar
        title="KeepSchool"
        iconElementLeft={<Avatar src={this.state.firebaseUser.photoURL}/>}
        iconElementRight={
          <ConfirmLink style={{display: 'flex', alignItems: 'center', height: '100%'}} action={this.handleLogout} actionArgs={{a:1, b:2}}>
            <FlatButton style={{color: 'white'}} label="Logout"/>
          </ConfirmLink>
        }
      />
    );
  }
}
