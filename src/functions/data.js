import hoverstate from 'react-hoverstate';
export function getData(component){
  let init = {
    data:null,
    niveau:2,
    start:1020,
    end:1040
  }
  if (hoverstate.state.data) {
    if (hoverstate.state.data[component.props.match.params.id]) {
      return hoverstate.state.data[component.props.match.params.id]
    }
    else {
      return init;
    }
  }
  else {
    return init;
  }
}
export function setData(component,object){
  let data=hoverstate.state.data;
  if (!data[component.props.match.params.id]) {
    data[component.props.match.params.id]={}
  }
  for (let variable in object) {
    data[component.props.match.params.id][variable]=object[variable];
  }
  hoverstate.setState({data});
}
