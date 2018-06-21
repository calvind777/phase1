import React, { Component } from 'react';
import logo from './full-logo.svg';
import './App.css';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {url: '', submitted: false, approved:false, success: false}
  }

  handleChange = (event) => {
    this.setState({url: event.target.value});
  }
  

  handleSubmit = (event) => {
    this.setState({submitted:true})
    console.log("woo");
    console.log(this.state)
    if (this.state.approved) {

      const success = ipcRenderer.sendSync('synchronous-message', this.state.url);
      console.log(success);
      if (success !== 'failed') {
        console.log('woo')
        this.setState({success: true});
        
      }
      else {
       

      }
    } 
  }

  handleCheck = (event) => {
    this.setState({approved: !this.state.approved});
    this.setState({submitted: false})

  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"></h1>
        </header>
        <p className="App-intro">
          <input type="text" onChange={this.handleChange} />
          <button type="button" onClick = {this.handleSubmit}>
            Navigate
          </button>
          
        </p>

        <div id="modal" hidden={!this.state.submitted || this.state.approved}>
          <div id="modal-content">
            <p > Allow a local copy of this repo to be downloaded? </p>
            <input type="checkbox" id="yes" onChange={this.handleCheck} hidden={!this.state.submitted}/>
            <label htmlFor="yes" hidden={!this.state.submitted}>Yes</label>
          </div>
        </div>

        <p id="success" hidden = {!this.state.success}> Your local copy has been downloaded. </p>
        <p id="failure" hidden = {!this.state.submitted || this.state.success}> Download failed. </p>

      </div>
    );
  }
}

export default App;
