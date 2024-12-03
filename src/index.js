import app from './server.js';

// Iniciar el servidor
app.listen(app.get('port'),()=>{
  console.log(`Server ok on http://localhost:${app.get('port')}`);
})