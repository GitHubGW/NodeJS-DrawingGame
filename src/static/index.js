// index.js는 클라이언트, server.js는 서버 역할을 하는 중임
// Socket을 연결시켜주는 io함수를 호출함 (기본 경로인 /로 연결됨)
// io("/")를 담고 있는 socket은 클라이언트 측 웹 소켓이다!
// (eslint때문에 io를 못 불러와서 eslint를 잠시 해제헀다)
// eslint-disable-next-line no-undef
const socket = io("/");

// server.js(서버)에서 socket.emit("hello")를 통해 hello라는 이벤트를 전달해줬고 이 이벤트를 받으려면 클라이언트(index.js)에서도 또한 socket.on("hello")을 통해 해당 이벤트를 들어야 한다.
// socket.on("hello", () => console.log("I listened hello"));

// 클라이언트측 웹 소켓으로도 emit()을 통해 웹 소켓 서버에 이벤트를 전달할 수 있다
// socket.emit("hello2");

// sendMessage라는 함수를 만들고 이 함수가 실행되면 실행될 때  message파라미터로 정보를 받아서 그 정보를 {message:message}를 통해 객체에 담아서 전달한다.
const sendMessage = (message) => {
  socket.emit("newMessage", { message: message });
  console.log(`You: ${message}`);
};

const handleMessageNotify = (data) => {
  // const message=data.message와 밑은 같은 의미이다(밑이 es6문법)
  const { message, nickname } = data;
  console.log(`${nickname}: ${message}`);
};

const setNickname = (nickname) => {
  socket.emit("setNickname", { nickname });
};

socket.on("messageNotify", handleMessageNotify);
