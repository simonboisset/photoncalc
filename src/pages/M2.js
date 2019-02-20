import React from 'react';
import {Legend,LineChart,Line,XAxis,YAxis,CartesianAxis} from 'recharts';
import {save2png} from '../functions';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import hoverstate from 'react-hoverstate';
import {photonEvent} from "../events";
import regression from 'regression';
class M2 extends React.Component {
  constructor()
  {
    super();
    this.state={
      data:null,
      niveau:2,
      start:1020,
      end:1040,
      wavelength:1030,
      Ymax:1,
      Ymin:0
    }
  }
  componentDidMount(){
    this.propsToState();
    photonEvent.on('loaddata', ()=>{
        this.propsToState();
    });
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
  propsToState = () => {
    if (hoverstate.state.data[this.props.match.params.id]) {
      let data = hoverstate.state.data[this.props.match.params.id];
      this.setState({
        data:data.data,
        start:data.start,
        end:data.end,
        wavelength:data.wavelength,
        Ymax:data.Ymax,
        Ymin:data.Ymin
      });
    }
    else {
      this.setProps({
        data:null,
        start:1020,
        end:1040,
        wavelength:1030,
      });
    }
  }
  stateToProps = () =>{
    let data = hoverstate.state.data;
    data[this.props.match.params.id]={
      data:this.state.data,
      start:this.state.start,
      end:this.state.end,
      wavelength:this.state.wavelength,
      Ymax:this.state.Ymax,
      Ymin:this.state.Ymin
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
    let domain = {};
    // return [Math.round((this.state.start)/5)*5,Math.round((this.state.end)/5)*5];
    domain.x = [this.state.start,this.state.end];
    domain.y = [this.state.Ymin,this.state.Ymax];
    return domain;
  }
  readpulse = (inputFile,niveau) => {
    let file = new FileReader();
    file.onload = () => {this.file2array(file.result,";")};
    file.readAsText(inputFile);
  }
  fit = (input,Ymin) =>{
    // let data = input;
    // let dataRegression ={X:[],Y:[]};
    // for (let i = 0; i < data.length; i++) {
    //     dataRegression.X[i]=[data[i][0]*1000,Math.pow(data[i][1],2)];
    //     dataRegression.Y[i]=[data[i][0]*1000,Math.pow(data[i][2],2)];
    // }
    // let resultX = regression.polynomial(dataRegression.X, { order: 2 ,precision: 15});
    // let resultY = regression.polynomial(dataRegression.Y, { order: 2 ,precision: 15});
    // let eqX = resultX.equation;
    // let eqY = resultY.equation;
    // let z0 = {
    //   X: -eqX[1]/(2*eqX[0]),
    //   Y: -eqY[1]/(2*eqY[0])
    // }
    // let w0 = {
    //   X:[Math.sqrt(eqX[2]-Math.pow(eqX[1],2)/(4*eqX[0])),Math.pow(((eqX[2]-Math.pow(eqX[1],2)/(4*eqX[0]))*Math.pow(this.state.wavelength/(1000*Math.PI),2))/eqX[0],1/4)],
    //   Y:[Math.sqrt(eqY[2]-Math.pow(eqY[1],2)/(4*eqY[0])),Math.pow(((eqY[2]-Math.pow(eqY[1],2)/(4*eqY[0]))*Math.pow(this.state.wavelength/(1000*Math.PI),2))/eqY[0],1/4)]
    // }
    // w0.X=[Ymin,Ymin];
    // w0.Y=[Ymin,Ymin];
    // for (let i = 0; i < data.length; i++) {
    //   data[i][3]=w0.X[0]*Math.sqrt(1+Math.pow((data[i][0]*1000-z0.X)*this.state.wavelength/(1000*Math.PI*Math.pow(w0.X[1],2)),2));
    //   data[i][4]=w0.Y[0]*Math.sqrt(1+Math.pow((data[i][0]*1000-z0.Y)*this.state.wavelength/(1000*Math.PI*Math.pow(w0.Y[1],2)),2));
    // }
    // let M2 ={X:w0.X[0]/w0.X[1],Y:w0.Y[0]/w0.Y[1]};
    // let div = {X:this.state.wavelength/(Math.PI*w0.X[1]),Y:this.state.wavelength/(Math.PI*w0.Y[1])};
    // console.log(div);
    // let Zr =Math.PI * Math.pow(w0.X[0],2) / (this.state.wavelength/1000);
    // return {data,w0,Zr,M2,z0};
    let data = input;
    let dataRegression ={X:[],Y:[]};
    let test = {X:false,Y:false};
    for (let i = 0; i < data.length; i++) {
      if (!test.X) {
        dataRegression.X[i]=[data[i][0]*1000,-Math.sqrt(Math.pow(data[i][1]/Ymin.X,2)-1)];
        if (dataRegression.X[i][1]===0) {
          test.X = true;
        }
      } else {
        dataRegression.X[i]=[data[i][0]*1000,Math.sqrt(Math.pow(data[i][1]/Ymin.X,2)-1)];
      }
      if (!test.Y) {
        dataRegression.Y[i]=[data[i][0]*1000,-Math.sqrt(Math.pow(data[i][2]/Ymin.Y,2)-1)];
        if (dataRegression.Y[i][1]===0) {
          test.Y = true;
        }
      } else {
        dataRegression.Y[i]=[data[i][0]*1000,Math.sqrt(Math.pow(data[i][2]/Ymin.Y,2)-1)];
      }
    }
    let resultX = regression.linear(dataRegression.X, { precision: 10});
    let resultY = regression.linear(dataRegression.Y, { precision: 10});
    let eqX = resultX.equation;
    let eqY = resultY.equation;
    let z0 = {
      X: -eqX[1]/eqX[0],
      Y: -eqY[1]/eqY[0]
    }
    let w0 = {
      X:[Ymin.X,Math.sqrt(this.state.wavelength/(1000*Math.PI*eqX[0]))],
      Y:[Ymin.Y,Math.sqrt(this.state.wavelength/(1000*Math.PI*eqY[0]))]
    }
    for (let i = 0; i < data.length; i++) {
      data[i][3]=w0.X[0]*Math.sqrt(1+Math.pow((data[i][0]*1000-z0.X)*this.state.wavelength/(1000*Math.PI*Math.pow(w0.X[1],2)),2));
      data[i][4]=w0.Y[0]*Math.sqrt(1+Math.pow((data[i][0]*1000-z0.Y)*this.state.wavelength/(1000*Math.PI*Math.pow(w0.Y[1],2)),2));
    }
    let M2 ={X:w0.X[0]/w0.X[1],Y:w0.Y[0]/w0.Y[1]};
    // let div = {X:this.state.wavelength/(Math.PI*w0.X[1]),Y:this.state.wavelength/(Math.PI*w0.Y[1])};
    // let Zr =Math.PI * Math.pow(w0.X[0],2) / (this.state.wavelength/1000);
    // console.log(M2);
    // calcul source result
    let f = 150;
    let Zr = {
      X:Math.PI * Math.pow(w0.X[1]/1000000,2) / (this.state.wavelength*f/1000000000000),
      Y:Math.PI * Math.pow(w0.Y[1]/1000000,2) / (this.state.wavelength*f/1000000000000)
    };
    console.log(Zr);
    w0.X[1]=Math.sqrt(Zr.X*(this.state.wavelength/1000000000)/Math.PI)*1000000;
    w0.Y[1]=Math.sqrt(Zr.Y*(this.state.wavelength/1000000000)/Math.PI)*1000000;
    let z ={X:150-z0.X/1000,Y:150-z0.Y/1000};
    // let z0_2 = f*(Math.pow(Zr.X,2)-z.X*(f-z.X)/1000000)/(Math.pow(f-z.X,2)/1000000+Math.pow(Zr.X,2));
    w0.X[0] = w0.X[0]/((f/1000)*Math.sqrt(Math.pow(f-z.X,2)/1000000+Math.pow(Zr.X,2)));
    w0.Y[0] = w0.Y[0]/((f/1000)*Math.sqrt(Math.pow(f-z.Y,2)/1000000+Math.pow(Zr.Y,2)));
    M2 ={X:w0.X[0]/w0.X[1],Y:w0.Y[0]/w0.Y[1]};
    console.log(M2);
    return {data,w0,Zr,M2,z0};
  }
  file2array = (file,spliter) => {
    let input = file;
    let Ymax=0,Ymin={X:null,Y:null};
    input = input.split(['\n']);
    input.splice(0,42);
    input.splice(input.length-3,3);
    let data=[];
    for (let i = 0; i < input.length-1; i++) {
      data[i]=input[i].split([',']);
      data[i].splice(0,1);
      data[i][0]=Number(data[i][0]);
      for (let ii = 1; ii < data[i].length; ii++) {
        data[i][ii]=Number(data[i][ii]/2);
        if(data[i][ii]>Ymax){
          Ymax=data[i][ii];
        }

      }
      if(data[i][1]<Ymin.X||Ymin.X===null){
        Ymin.X=data[i][1];
      }
      if(data[i][2]<Ymin.Y||Ymin.Y===null){
        Ymin.Y=data[i][2];
      }
    }
    let result = this.fit(data,Ymin);
    data = result.data;
    const l = data.length;
    Ymin={X:null,Y:null};
    for (let i = 0; i < l; i++) {
      // temp.push(data[i]);
      // if (data[i][0]*1000>result.z0.X-result.Zr && data[i][0]*1000<result.z0.X+result.Zr) {
      //   temp.push(data[i]);
      //   temp.push(data[i]);
      //   temp.push(data[i]);
      // }
      let diff1 = Math.pow(data[i][1]-data[i][3],2)+Math.pow(data[i][2]-data[i][4],2);
      let diff2 = Math.pow(data[i][1]-data[i][4],2)+Math.pow(data[i][2]-data[i][3],2);
      if (diff2<diff1) {
        let temp = data[i][1];
        data[i][1]=data[i][2];
        data[i][2]=temp;
      }
      if(data[i][1]<Ymin.X||Ymin.X===null){
        Ymin.X=data[i][1];
      }
      if(data[i][2]<Ymin.Y||Ymin.Y===null){
        Ymin.Y=data[i][2];
      }
    }
    result = this.fit(data,Ymin);
    data = result.data;
    for (let i = 0; i < data.length; i++) {
      data[i]={name:data[i][0],waistX:data[i][1],waistY:data[i][2],fitX:data[i][3],fitY:data[i][4]};
    }
    let start = data[0].name;
    let end = data[data.length-1].name;
    Ymin=Math.min(Ymin.X,Ymin.Y);
    this.setState({data,start,end,Ymax,Ymin});
    this.setProps({data,start,end,Ymax,Ymin});
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
    }
  }
  renderpulse=()=>{
    return(
      <div ref="targetimg" id="targetimg">
      <LineChart  width={550} height={400} data={this.state.data}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis allowDataOverflow={true} type="number" dataKey="name" domain={this.domain().x}
          label={{ value: 'Wavelength (nm)', offset: -5, position: 'insideBottom' }} ticks={this.ticks()} scale="linear"/>
        <YAxis hide={false} allowDataOverflow={true} type="number" domain={this.domain().y}
          label={{ value: 'Intensity (a.u)', angle: -90, position: 'insideLeft' }}/>

        <CartesianAxis/>
        <Legend
          layout='vertical'
          payload={[
            { value: `\u03BBc : ${this.wavelength().centralWL}nm`, type: 'line', id: 'ID01' },
            { value: `\u0394\u03BB : ${this.wavelength().deltaWL}nm`, type: 'line', id: 'ID02' }
          ]}
          wrapperStyle={{
            top:50,
            left: 100,
            float: 'left'
          }}/>
        <Line  dot={{ fill: 'red',r:2}}type="linear" dataKey="waistX" stroke='none'  />
        <Line  dot={{ fill: 'blue',r:2 }}type="linear" dataKey="waistY" stroke='none'  />
        <Line  dot={false}type="linear" dataKey="fitX" stroke='red'  />
        <Line  dot={false}type="linear" dataKey="fitY" stroke='blue'/>
      </LineChart>
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
export default M2;
