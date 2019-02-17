import React from 'react';
import {save2png} from '../functions';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import hoverstate from 'react-hoverstate';
import {photonEvent} from "../events";
import vis from "vis";
class Mode extends React.Component {
  constructor()
  {
    super();
    this.state={
      data:null,
    }
  }
  setProps=(object)=>{
    let data = hoverstate.state.data;
    hoverstate.setState({data});
    for (let variable in object) {
      if (data[this.props.match.params.id]) {
        data[this.props.match.params.id][variable]=object[variable];
      }
      else {
      data[this.props.match.params.id]={[variable]:object[variable]};
      }
    }
  }
  componentDidMount=async ()=>{
    await this.propsToState();
    if (this.state.data) {
      let data = new vis.DataSet()
      data.add(this.state.data);
      // var options = {
      //     width:  '500px',
      //     height: '552px',
      //     style: 'surface',
      //     showPerspective: false,
      //     showGrid: false,
      //     showXAxis:false,
      //     showYAxis:false,
      //     showZAxis:false,
      //     showShadow: false,
      //     keepAspectRatio: false,
      //     verticalRatio: 1,
      // };
      // var container = document.getElementById('visualization');
      // var graph3d = new vis.Graph3d(container, data, options);
    }
    photonEvent.on('loaddata', ()=>{
        this.propsToState();
    });
  }
  propsToState = () => {
    if (hoverstate.state.data[this.props.match.params.id]) {
      let data = hoverstate.state.data[this.props.match.params.id];
      this.setState({data:data.data});
    }
    else {
      this.setProps({
        data:null,
      });
    }
  }
  stateToProps = () =>{
    let data = hoverstate.state.data;
    data[this.props.match.params.id]={
      data:this.state.data,
    };
    hoverstate.setState({data});
  }
  ticks = () =>{
    let interval = (this.state.end-this.state.start)/7;
    let ticks=[], i = 0, y = 0;
    while (this.state.start+y <= this.state.end) {
      ticks[i]=Math.round((this.state.start+y)/5)*5;
      i++;
      y = y + interval;
    }
    return ticks;
  }
  domain = () => {
    return [Math.round((this.state.start)/5)*5,Math.round((this.state.end)/5)*5];
  }
  readpulse = (inputFile,niveau) => {
    let file = new FileReader();
    file.onload = () => {this.file2array(file.result,";")};
    file.readAsText(inputFile);
  }
  file2array = (file,spliter) =>{
    let input = file;
    let Ymax=0,Ymin=null;
    input = input.split([';']);
    input.splice(0,5);
    let data=[];
    for (let i = 0; i < input.length-1; i++) {
      data[i]=input[i].split([',']);
      for (let ii = 0; ii < data[i].length; ii++) {
        data[i][ii]=Number(data[i][ii]);
        if(data[i][ii]>Ymax){
          Ymax=data[i][ii];
        }
        if(data[i][ii]<Ymin||Ymin===null){
          Ymin=data[i][ii];
        }
      }
    }
    let count = 0;
    var temp = [];
    for (let i = 7; i < data.length-7; i=i+16) {
      for (let ii = 7; ii < data[i].length-7; ii=ii+16) {
        let z =0;
        for (var ix = i-7; ix < i+7; ix++) {
          for (var iy = ii-7; iy <ii+7; iy++) {
            z=z+data[ix][iy];
          }
        }
        z = z/225;
        temp.push({id:count++, x:i, y:ii, z:z});
      }
    }
    data=temp;
    let dataset = new vis.DataSet();
    dataset.add(temp);
    // var options = {
    //     width:  '500px',
    //     height: '552px',
    //     style: 'surface',
    //     showPerspective: false,
    //     showGrid: false,
    //     showXAxis:false,
    //     showYAxis:false,
    //     showZAxis:false,
    //     showShadow: false,
    //     keepAspectRatio: false,
    //     verticalRatio: 1,
    // };
    // var container = document.getElementById('visualization');
    // var graph3d = new vis.Graph3d(container, dataset, options);
    this.setState({data});
    this.setProps({data});
  }
  wavelength = () =>{
    if (this.state.data===null || this.state.niveau===0) {
      return {deltaWL:0,centralWL:0,X_FWHM_max:0,X_FWHM_min:0};
    }
    else {
      let X_FWHM_max =this.state.data[0].name;
      let X_FWHM_min = this.state.data[this.state.data.length-2].name;
      for (let i = 0; i < this.state.data.length-1; i++) {
        if ((this.state.data[i].pulse<=1/this.state.niveau && 1/this.state.niveau<=this.state.data[i+1].pulse)||(this.state.data[i].pulse>=1/this.state.niveau && 1/this.state.niveau>=this.state.data[i+1].pulse)){
          if(X_FWHM_max<this.state.data[i].name){
            X_FWHM_max = this.state.data[i].name;
          }
          if(X_FWHM_min>this.state.data[i].name){
            X_FWHM_min = this.state.data[i].name;
          }
        }
      }
      let deltaWL = X_FWHM_max - X_FWHM_min;
      let centralWL = (X_FWHM_max + X_FWHM_min)/2;
      centralWL = Math.round(centralWL*100)/100;
      deltaWL = Math.round(deltaWL*100)/100;
      return {deltaWL,centralWL,X_FWHM_max,X_FWHM_min};
      // let start = Math.round((X_FWHM_min - deltaWL-1)/5)*5;
      // let end = Math.round((X_FWHM_max + deltaWL-1)/5)*5;
    }
  }
  renderpulse=()=>{
    return(
      <div ref="targetimg" id="targetimg">
      <div id="visualization"></div>
    </div>
    );
  }
  render() {
    return(
    <Div justify="space-around" row margin="25px" width="100%">
    <Div margin="25px" align="center">
      <input style={{display: 'none'}}type="file" id="input-file-pulse" onChange={(event)=>{this.readpulse(event.target.files[0],this.state.niveau)}}/>
      <Button variant="outlined" onClick={(e) => document.getElementById("input-file-pulse").click()}>Charger pulse</Button>
      <Div margin="15px 0 0 0"><Input
        label="Niveau de la largeur"
        type="number"
        value={this.state.niveau}
        onChange={(e)=>{
            this.setState({niveau:e.target.value});
            this.setProps({niveau:e.target.value});
          }}
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              1/
            </InputAdornment>
          ),
        }}
      /></Div>
      <Div margin="15px 0 0 0"><Input
        label="Start"
        type="number"
        value={this.state.start}
        onChange={(event)=>{
          this.setState({start:Number(event.target.value)});
          this.setProps({start:Number(event.target.value)});
        }}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              nm
            </InputAdornment>
          ),
        }}
      /></Div>
      <Div margin="15px 0 15px 0"><Input
        label="End"
        type="number"
        value={this.state.end}
        onChange={(event)=>{
          this.setState({end:Number(event.target.value)});
          this.setProps({end:Number(event.target.value)});
        }}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              nm
            </InputAdornment>
          ),
        }}
      /></Div>
      <Button width="100%" variant="contained" onClick={()=>{save2png(this.refs.targetimg)}}>Screenshot</Button>
    </Div>
    <Div margin="25px">{this.renderpulse()}<div id="loadImg"></div></Div>
    </Div>
    );
  }
}
export default Mode;
