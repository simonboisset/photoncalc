import hoverstate from 'react-hoverstate';
export function getData(id){
  if (hoverstate.state.data) {
    if (hoverstate.state.data[id]) {
      return hoverstate.state.data[id]
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
export function setData(id,object){
  let data=hoverstate.state.data;
  if (!data[id]) {
    data[id]={}
  }
  for (let variable in object) {
    data[id][variable]=object[variable];
  }
  hoverstate.setState({data});
}
