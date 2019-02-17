export function download(obj){
  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  var a = document.createElement('a');
  a.href = 'data:' + data;
  a.download = 'data.json';
  a.innerHTML = 'download JSON';

  a.style = "display: none";
  document.body.appendChild(a);
  // let url = URL.createObjectURL(blob);
  // link.href = url;
  // link.download = "picture.jpg";
  a.click();
  // URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
