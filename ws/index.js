const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('./database');

app.use(morgan('dev'));
app.use(express.json());

app.set('port', 8000);



app.use('/salao', require('./src/routes/salao.routes'))

app.listen(app.get('port'), () => {
  console.log(`WS Escutando na porta ${app.get('port')}`);
});