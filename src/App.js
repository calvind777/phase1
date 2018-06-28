import React, { Component } from 'react';
import logo from './full-logo.svg';
import './App.css';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {url: '', submitted: false, approved:false, success: false, installing: false};
    ipcRenderer.on('download-status', (event, arg1, arg2) => {
      if (arg1 === 'failed') {
        this.setState({success: false});
      }
      else if (arg1 === 'success') {
        this.setState({success: true});
        this.setState({installing: true})
        console.log('download succeeded')
        ipcRenderer.send('download', 'success', arg2);
        
      }
      else {

      }
    });
  }

  handleChange = (event) => {
    this.setState({url: event.target.value});
  }
  

  handleSubmit = (event) => {
    this.setState({submitted:true})
    console.log("woo");
    console.log(this.state)
    if (this.state.approved) {

      ipcRenderer.send('download','approved', this.state.url);
  
    } 
  }

  handleCheck = (event) => {
    this.setState({approved: !this.state.approved});
    this.setState({submitted: false});

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
        <p id="installing" hidden = {!this.state.installing}> Installing dependencies... </p>

      </div>
    );
  }
}

export default App;
