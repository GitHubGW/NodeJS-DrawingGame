import express from "express";
import { join } from "path"; // path모듈을 사용하면 폴더와 파일의 경로를 쉽게 조작할 수 있다
import socketIO from "socket.io"; // WebSocket을 사용하려면 socket.io 패키지가 필요하다.
import morgan from "morgan";

const app = express();

const PORT = 4000;

// 템플릿 엔진의 기본 경로는 root/views이다. (가장 상단에 views)
// 만약 경로를 변경했을 때는 가장 상단 폴더를 기준으로 설정해준다.
app.set("views", "src/views");
app.set("view engine", "pug");

app.use(morgan("dev"));
// express.static()을 통해 express가 정적 파일(이미지나 CSS, JS파일 등)을 읽어올 수 있는 폴더를 만들 수 있다
app.use(express.static("src/static"));

app.get("/", (req, res) => {
  res.render("home.pug");
});

const handleListening = (req, res) => {
  console.log(`😀 Server running: http://localhost:${PORT}`);
};

const server = app.listen(PORT, handleListening);

// 위에서 만든 웹 서버를 server라는 변수에 넣은 후 그 변수를 가져와서 웹 소켓 서버를 만들었다. (io는 소켓 서버이다.)
// 소켓 서버를 의미하는 변수 io를 만든 이유는 소켓 서버를 통해 다른 웹 소켓 서버들과 통신하고 이벤트를 컨트롤하기 위해서이다.
const io = socketIO(server);

// 웹 소켓 서버는 connection이라는 이벤트를 듣고 있다가 connection 이벤트가 발생하면 콜백함수를 실행한다.
// 콜백 함수는 파라미터로 "방금 연결된 소켓"을 객체로 가져온다.
// 여기 connection 부분이 socketIo의 시작점이다.
// socket객체는 express위에서 보내는 HTTP요청과 비슷하다. 소켓은 어떤 요청이나 응답을 받고 request를 콘솔에 보여줄 수 있다.
// 기타 상식: 이 부분은 서버의 메모리 부분이다. 그래서 만약 수정을 하면 nodemon이 자동으로 서버를 다시 실행하게 되고 그러면 소켓의 메모리가 날아가게 된다.
// 그래서 소켓이 실행되면서 저장하고 있던 정보가 날아가버린다. 그래서 정보가 날아가지 않고 계속 남아있게 하려면 데이터베이스가 필요한 것이다.
io.on("connection", (socket) => {
  // socket에 연결이 되면 socket객체 안에 있는 여러 프로퍼티들을 가져올 수 있다. (ex: socket.id 등등) (소켓은 id값이 다 달라서 이것으로 소켓들을 구분할 수 있다.)
  // console.log(socket.id);
  // 방금 연결된(접속한) 소켓에게 emit()함수를 통해 "hello"라는 이벤트를 보낸다(발생시킨다)
  // 여기서 보낸 hello라는 이벤트는 클라이언트(index.js)로 가게 되고 클라이언트에서 hello 이벤트를 들어야 통신할 수 있다.
  // socket.emit("hello");
  // broadcast는 방금 연결된(접속한) 클라이언트 소켓을 제외하고 모든 클라이언트에게 통신을 보낸다
  // socket.broadcast.emit("hello");
  // 방금 연결된(접속한) 소켓으로부터 hello2라는 이벤트를 듣고 있다가 이벤트가 오면 콜백함수를 실행함
  // socket.on("hello2", () => console.log("I listened hello2"));

  // 연결된 socket으로부터 newMessage라는 이벤트를 듣는다.
  // 이벤트에 연결되면 콜백함수는 이벤트와 함께 정보가 들어있는 message객체를 받을 수 있다
  // 함수 파라미터로 받을 때 {message: message}를 {message}형태로 받게 되면 message키의 벨류값을 직접 받게 된다.
  // socket.nickname || Anonymous의 의미는 앞에 socket.nickname이 없다면 뒤에 Anonymous로 값을 처리하겠다는 의미이다.
  socket.on("newMessage", ({ message }) => {
    // console.log("message", message);
    socket.broadcast.emit("messageNotify", { message: message, nickname: socket.nickname || "Anonymous" });
  });

  socket.on("setNickname", ({ nickname }) => {
    // console.log("nickname", nickname);
    socket.nickname = nickname;
  });
});
