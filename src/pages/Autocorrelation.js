import React from 'react';
import {Page} from "src/containers";
import regression from 'regression';
import { withRouter } from 'react-router-dom';
class Autocorrelation extends React.Component {
  
  traitement=(input,Ymin,Ymax)=>{
    let data = input;
    let dataRegression=[];
    let test = false;
    let ii = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i][1]>Ymax/3) {
        if (!test) {
          dataRegression[ii]=[data[i][0],-Math.acosh(1/Math.sqrt((data[i][1]-Ymin*0.99)/(Ymax-Ymin*0.99)))];
          if (dataRegression[ii][1]===0) {
            test = true;
          }
        } else {
          dataRegression[ii]=[data[i][0],Math.acosh(1/Math.sqrt((data[i][1]-Ymin*0.99)/(Ymax-Ymin*0.99)))];
        }
        ii++;
      }
    }
    let result = regression.linear(dataRegression, {precision: 10});
    let eq = result.equation;
    for (let i = 0; i < data.length; i++) {
      data[i]={name:data[i][0],pulse:(data[i][1]-Ymin*0.99)/(Ymax-Ymin*0.99),fit:1/(Math.pow(Math.cosh((data[i][0]*eq[0])+eq[1]),2))};
    }

    let start = data[0].name;
    let end = data[data.length-1].name;
    return {data,start,end};
  }
  analyse = (data) =>{
    // let data = getData(this.props.match.params.id);
    // if(data.data.length<5){
    //   return {deltaWL:0,X_FWHM_max:0,X_FWHM_min:0};
    // }
    // else{
      let X_FWHM_max =data.data[0].name;
      let X_FWHM_min = data.data[data.data.length-1].name;
      let somme = 0, diff = 0;
      for (let i = 0; i < data.data.length-1; i++) {
        somme = somme + data.data[i].fit;
        diff = diff + Math.abs(data.data[i].pulse-data.data[i].fit);
        if ((data.data[i].fit<=1/data.level && 1/data.level<=data.data[i+1].fit)||(data.data[i].fit>=1/data.level && 1/data.level>=data.data[i+1].fit)){
          if(X_FWHM_max<data.data[i].name){
            X_FWHM_max = data.data[i].name;
          }
          if(X_FWHM_min>data.data[i].name){
            X_FWHM_min = data.data[i].name;
          }
        }
      }
      let quality = (1 - diff/somme)*100;
      let deltaWL = (X_FWHM_max - X_FWHM_min)*685;
      quality = Math.round(quality*100)/100;
      deltaWL = Math.round(deltaWL);
      return {quality,deltaWL,X_FWHM_max,X_FWHM_min};
    // }
  }
  render() {
    return(
      <Page
      traitement={this.traitement} analyse={this.analyse}
      param={{firstline:15,lastline:1, firstcol:1, lastcol:2, spliter: /\s+/}}
      init={{data:[],start:0,end:5,level:2}} 
      inputs={[
        {
          label:"level de la largeur",
          add:{
            position:"start",
            value:"1/"
          },
          value:"level"
        },
        {
          label:"Start",
          add:{
            position:"end",
            value:"nm"
          },
          value:"start"
        },
        {
          label:"End",
          add:{
            position:"end",
            value:"nm"
          },
          value:"end"
        }
        ]}
      />
    );
  }
}
export default withRouter(Autocorrelation);
