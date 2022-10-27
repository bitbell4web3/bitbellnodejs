const WebSocket = require('ws')

const conf = require('config')
const opensea_ws_base_end_point = conf.ws.opensea_ws_base_endpoint 
const ws = new WebSocket(opensea_ws_base_end_point);

ws.on('open', function open() {

  let subscribe = {
    "topic": "collection:boredapeyachtclub",
    "event": "phx_join",
    "payload": {},
    "ref": 0
  }

    var subscribe_str = JSON.stringify(subscribe);


  setTimeout(function timeout() {
    ws.send(subscribe_str);
  }, 500);
});

ws.on('close', function close() {
});

ws.on('message', function message(data) {
    var textChunk = data.toString('utf8');

});