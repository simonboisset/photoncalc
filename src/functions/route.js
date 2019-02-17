import hoverstate from 'react-hoverstate';
export function undefinedRoute(component){
  if (hoverstate.state.data) {
    if (!hoverstate.state.data[component.props.match.params.id]) {
      component.props.history.push('/');
    }
  }
  else {
    component.props.history.push('/');
  }
}
