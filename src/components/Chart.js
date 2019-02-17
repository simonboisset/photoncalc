import React from 'react';
import {ReferenceLine,Legend,AreaChart,Area,XAxis,YAxis,CartesianAxis} from 'recharts';
import {guid} from "../functions";
// Props input :
// referenceline
// legend
// area
// ticks
// domain
// x
// y


export class Chart extends React.Component {
    ticks=()=>{
        let interval = (this.props.data.end-this.props.data.start)/7;
        let ticks=[], i = 0, y = 0;
        while (this.props.data.start+y <= this.props.data.end) {
          ticks[i]=Math.round((this.props.data.start+y)/5)*5;
          i++;
          y = y + interval;
        }
        return ticks;
    }
    domain=()=>{
        return [Math.round((this.props.data.start)/5)*5,Math.round((this.props.data.end)/5)*5];
    }
      
    renderReferenceLine = () => {
        if(this.props.referenceline){
            
            return (
                this.props.referenceline.map((line) =>
                    line.type==="y" ? (
                        <ReferenceLine key={guid()} y={line.value} stroke="red" strokeDasharray="3 3"/>
                    ) : (
                        <ReferenceLine key={guid()} x={line.value} stroke="red" strokeDasharray="3 3"/>
                    )
                )
            );
        }
    }
    renderArea = () => {
        if(this.props.area){
            return (
                this.props.area.map((line) =>
                    <Area key={guid()} dot={false} type="linear" dataKey={line.name} stroke='none' fill={line.color}/>
                )
            );
        }
    }
    renderLegend=()=>{
        if(this.props.legend){
            return (
                <Legend
                    layout='vertical'
                    payload={this.legend()}
                    wrapperStyle={{
                        top:50,
                        left: 100,
                        float: 'left'
                    }}
                />
            );
        }
    }
    legend=()=>{
        return this.props.legend.map((label) => ({value: label, type: 'line'}));
    }
    render() {
      return (
        <AreaChart  width={550} height={400} data={this.props.data.data}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis allowDataOverflow={true} type="number" dataKey="name" domain={this.domain()}
          label={{ value: this.props.xlabel, offset: -5, position: 'insideBottom' }} ticks={this.ticks()} scale="linear"/>
        <YAxis hide={false} allowDataOverflow={true} type="number" domain={[0, 1]}
          label={{ value: this.props.ylabel, angle: -90, position: 'insideLeft' }}/>
        <CartesianAxis/>
        {this.renderLegend()}
        {this.renderReferenceLine()}
        {this.renderArea()}
      </AreaChart>
      );
    }
  }