// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 3000;

// Array com as credenciais do usuário
const usuarios = [
    { usuario: 'usuario1', senha: 'senha1' },
    { usuario: 'usuario2', senha: 'senha2' }
];

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Rota para a página de login
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para autenticação
app.post('/auth', (req, res) => {
    const { usuario, senha } = req.body;
    const usuarioValido = usuarios.find(user => user.usuario === usuario && user.senha === senha);
    if (usuarioValido) {
        res.cookie('autenticado', true);
        res.redirect('/pagina_usuario');
    } else {
        res.send('Usuário ou senha incorretos');
    }
});

// Middleware para verificar se o usuário está autenticado
app.use((req, res, next) => {
    if (req.cookies.autenticado) {
        next();
    } else {
        res.redirect('/');
    }
});

// Rota para a página do usuário
app.get('/pagina_usuario', (req, res) => {
    res.render('pagina_usuario', { usuario: 'Usuário' });
});

// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('autenticado');
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
