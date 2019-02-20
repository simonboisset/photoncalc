import React from 'react';
import {Button,Div} from "../components";
import hoverstate from 'react-hoverstate';
import datasample from "../sample/data.json";
import {photonEvent} from "../events";
import {download} from "../functions";
class Home extends React.Component {
  save = () => {
    let save = {
      id:hoverstate.state.id,
      menu:hoverstate.state.menu,
      data:hoverstate.state.data
    };
    download(save);
  }
  exemple =async ()=>{
    hoverstate.setState({id:datasample.id,data:datasample.data,menu:datasample.menu});
    photonEvent.emit('loaddata');
    photonEvent.emit('loadmenu');
  }
  upload = (inputFile)=>{
    let file = new FileReader();
    file.onload = () => {this.traitement(file.result)};
    file.readAsText(inputFile);
  }
  traitement=async (datajson)=>{
    let data = JSON.parse(datajson);
    hoverstate.setState({id:data.id,data:data.data,menu:data.menu});
    photonEvent.emit('loaddata');
    photonEvent.emit('loadmenu');
  }
  render() {
    return (
      <Div justify="space-around" align="center" width="100%" height={`${window.innerHeight-100}px`} background="blue">
        <Button color="primary" variant="contained" width="30%" onClick={this.save}>Save File</Button>
        <Button color="primary" variant="contained" width="30%" onClick={this.exemple}>Load Exemple</Button>
        <input style={{display: 'none'}}type="file" id="input-file-pulse" onChange={(event)=>{this.upload(event.target.files[0])}}/>
        <Button color="secondary" variant="contained" width="30%" onClick={(e) => document.getElementById("input-file-pulse").click()}>Upload File</Button>
      </Div>
    );
  }
}
export default Home;
