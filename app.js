const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pug = require('pug');
const path = require('path');
const router = express.Router();

const app = express();
app.set('port', process.env.PORT || 3000);
//퍼그 설정
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
//쿠키 파서에 서명 주가
app.use( cookieParser( process.env.COOKIE_SECRET ));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 6000000,
    },
    name: 'session-cookie'
}));

// 책 정보 담을 배열
const books = {};

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.sessionID);
    req.session.views = (req.session.views || 0) + 1;
    next();
});

//로그인 성공시 -> 메인페이지로 이동
app.get('/', (req, res) => {
    console.log(req.signedCookies);
    if( req.signedCookies.admit )
        res.redirect('/main');
    else
        res.redirect('/login');
});

app.get('/body', (req, res) => {
    res.render('body');
});

// login 렌더 (pug)
app.get('/login', (req, res) => {
    res.render('login');
});

// main 렌더 (pug)
app.get('/main', (req, res) => {
    res.render('main');
});

// share 렌더 (pug)
app.get('/share', (req, res) => {
    res.render('share');
});

app.get('/admit', (req,res) => {
  console.log(req.query);
  console.log(req.body);
  res.send(`username: ${req.query.login}<br>
            password: ${req.query.password}`);
});

app.post('/admit', (req, res) => {
    const{login, password} = req.body;

    //id password객체로 전달
    if(login == 'admin' && password == '7777'){
        res.cookie('admit', true, {
            maxAge: 600000,
            httpOnly: true,
            path: '/',
            signed: true
        });
        res.redirect('/main');
    }else{
        res.redirect('/login');
    }
});

// book 렌더 (pug)
app.get('/book', (req, res) => {
    res.render('book')
});

// upload 렌더 (pug)
app.get('/upload', (req, res) => {
    res.render('upload')
});

// edit 렌더 (pug)
app.get('/edit', (req, res) => {
    res.render('edit')
});

app.get('/books', (req, res) => {
    res.send(books);
});

app.post('/book', (req, res) => {
    const {name, school, contents} = req.body;
    const id = Date.now();
    books[id] = {name, school, contents};
    res.end();
});

app.put('/book/:id', (req, res) => {
    const {name, school, contents} = req.body;
    books[req.params.id] = {name, school, contents};
    res.end();
});

//책 정보 삭제
app.delete('/book/:id', (req, res) => {
    delete books[req.params.id];
    res.end();
});

//에러 처리
app.use((err, req, res, next) => {
    res.status(401).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(`App listening at http://localhost:${app.get('port')}`)
});