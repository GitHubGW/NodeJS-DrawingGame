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

// server라는 변수에 서버를 실행하는 것을 담고 그것을 socketIO로 전달해준 것이다.
// io라는 변수를 만든 이유는 여러 이벤트들을 듣고 컨트롤하기 위해서이다.
const io = socketIO(server);

let sockets = [];

// socketIO는 connection이라는 이벤트를 듣고 있고 이벤트가 발생하면 콜백함수를 실행함
// 여기 connection 부분이 socketIo의 시작점이다.
// ()=>{} 함수안에 socket 파라미터에는 연결된 Socket에 대한 여러 정보들을 가지고 있는 request 객체이다.
// socket파라미터는 express위에서 보내는 HTTP요청과 비슷하다. 어떤 요청이나 응답을 받고 request를 콘솔에 보여줄 수 있다.
io.on("connection", (socket) => {
  // socket에 연결이 되면 socket객체 안에 있는 socket.id의 값을 가져온다. (소켓은 id값이 다 달라서 이것으로 구분할 수 있다.)
  sockets.push(socket.id);
});

setInterval(() => console.log(sockets), 1000);
