import store from "../store";

const socket = {};

socket.install = function(Vue) {
  const ws = new WebSocket("ws://localhost:5000");

  ws.onopen = function() {
    console.log("connect socket server: storeid--" + store.state.info.id);
    sendData({
      event: "storeAuthorize",
      data: {
        storeid: store.state.info.id
      }
    });
  };

  ws.onmessage = function(res) {
    console.log("onmessage:\n" + res.data);
    listening(res.data, ws, events);
  };

  ws.onclose = function(e) {
    console.log(e);
  };

  var sendData = function(data) {
    ws.send(JSON.stringify(data));
  };

  ws.sendData = sendData;

  Vue.prototype.$socket = {
    send: sendData
  };
};

var events = [
  ["scanSuccess", scanSuccess],
  ["receiveOrder", receiveOrder]
];

function listening(data, ws, events) {
  let res = JSON.parse(data);
  for (let i = 0; i < events.length; i++) {
    const element = events[i];
    if (element[0] == res.event) {
      element[1].call(null, res.data, ws);
    }
  }
}

function scanSuccess(data, ws) {
  console.log("scanSuccess:\n" + data);
  store.commit("pushCustomers", data.customer);
  ws.sendData({
    event: "storeResponse",
    data: {
      customer: data.customer,
      msg: "亲爱的" + data.customer + ", 欢迎您进店用餐，祝您用餐愉快"
    }
  });
}

function receiveOrder(data) {
  console.log("receive" + data);
  store.commit("pushOrder", data);
}

export default socket;
