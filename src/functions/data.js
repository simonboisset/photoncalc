import hoverstate from 'react-hoverstate';
export function getData(id){
  let init = {
    data:null,
    niveau:2,
    start:1020,
    end:1040
  }
  if (hoverstate.state.data) {
    if (hoverstate.state.data[id]) {
      return hoverstate.state.data[id]
    }
    else {
      return init;
    }
  }
  else {
    return init;
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
