export function guid(){
  let key = new Uint16Array(5);
  window.crypto.getRandomValues(key);
  key=key.join('-');
  return key;
}
