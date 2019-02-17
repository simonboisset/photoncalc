export function ticks(data){
  let interval = (data.end-data.start)/7;
  let ticks=[], i = 0, y = 0;
  while (data.start+y <= data.end) {
    ticks[i]=Math.round((data.start+y)/5)*5;
    i++;
    y = y + interval;
  }
  return ticks;
}
export function domain(data){
  return [Math.round((data.start)/5)*5,Math.round((data.end)/5)*5];
}
