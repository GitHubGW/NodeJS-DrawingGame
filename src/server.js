// path모듈을 사용하면 폴더와 파일의 경로를 쉽게 조작할 수 있다
import { join } from "path";
import express from "express";
import socketIO from "socket.io";

const app = express();

const PORT = 5000;

// 템플릿 엔진의 기본 경로는 root/views이다. (가장 상단에 views)
// 만약 경로를 변경했을 때는 가장 상단 폴더를 기준으로 설정해준다.
app.set("views", "src/views");
app.set("view engine", "pug");

// express.static()을 통해 express가 정적 파일(이미지나 CSS, JS파일 등)을 읽어올 수 있는 폴더를 만들 수 있다
app.use(express.static("src/static"));

app.get("/", (req, res) => {
  res.render("home.pug");
});

const handleListening = (req, res) => {
  console.log(`😀 Server running: http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
