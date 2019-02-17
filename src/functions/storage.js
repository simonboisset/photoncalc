import html2canvas from 'html2canvas';
export function save2png(target){
  html2canvas(target).then((canvas)=> {
    canvas.toBlob(function(blob) {
      // var url = URL.createObjectURL(blob);
      // window.open(url,'_blank');
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.style = "display: none";
      let url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "picture.jpg";
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    });
    // let data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "");
    // // let buf = new Buffer(data, 'base64');
    // fs.writeFile(`${path}image.png`, buf);
  });
}
// export function openCanvas(target){
//   html2canvas(target).then((canvas)=> {
//     canvas.toBlob(function(blob) {
//         let link = document.createElement("a");
//         document.body.appendChild(link);
//         link.style = "display: none";
//         let url = URL.createObjectURL(blob);
//         link.href = url;
//         link.download = "picture.jpg";
//         link.click();
//         URL.revokeObjectURL(url);
//         document.body.removeChild(link);
//     });
// }
export function screenshot2blob(target){
  return html2canvas(target).then((canvas)=> {
    return canvas.toBlob(function(blob) {
        return blob;
    });
  });
}
