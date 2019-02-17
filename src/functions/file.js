export function readFile(inputFile,callback,param){
  let file = new FileReader();
  file.onload = () => {file2array(file.result,param,callback)};
  file.readAsText(inputFile);
}
function file2array(file,param,callback){
  // param : firstline, lastline, firstcol, lastcol, xcol
  let input = file;
  input = input.split(['\n']);
  if (param.firstline) {
    input.splice(0,param.firstline);
  }
  if (param.lastline) {
    input.splice(input.length-param.lastline,param.lastline);
  }
  let data=[],Ymax=[],Ymin=[];
  for (let i = 0; i < input.length; i++) {
    data[i]=input[i].split(param.spliter);
    if (param.firstcol) {
      data[i].splice(0,param.firstcol);
    }
    if (param.lastcol) {
      data[i].splice(data[i].length-param.lastcol,param.lastcol);
    }
    for (let ii = 0; ii < data[i].length; ii++) {
      let y=0;
      // data[i][ii]=data[i][ii].replace(',','.');
      data[i][ii]=Number(data[i][ii]);
      if (ii!==0) {
        if(data[i][ii]>Ymax[y]|| !Ymax[y]){
          Ymax[y]=data[i][ii];
        }
        if(data[i][ii]<Ymin[y]|| !Ymin[y]){
          Ymin[y]=data[i][ii];
        }
        y++;
      }
    }
  }
  callback(data,Ymin[0],Ymax[0]);
}
