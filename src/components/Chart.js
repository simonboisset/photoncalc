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
    renderReferenceLine = () => {
        if(this.props.referenceline){
            return (
                this.props.referenceline.map((line) =>
                    <div key={guid()}>
                        {line.type==="y" ? (
                            <ReferenceLine y={line.value} stroke="red" strokeDasharray="3 3"/>
                        ) : (
                            <ReferenceLine x={line.value} stroke="red" strokeDasharray="3 3"/>
                        )}
                    </div>
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
        <AreaChart  width={550} height={400} data={this.props.data}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis allowDataOverflow={true} type="number" dataKey="name" domain={this.props.domain}
          label={{ value: this.props.xlabel, offset: -5, position: 'insideBottom' }} ticks={this.props.ticks} scale="linear"/>
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