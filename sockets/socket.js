const {io} = require('../index')

const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controller/socket');


// Mesajes de Sockets
io.on('connection', client => {
   console.log('Cliente conectado');

   const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
   
   // Verificar autenticacion
   if(!valido){
      return client.disconnect();
   }

   // Cliente autenticado
   usuarioConectado(uid);

   // Ingresar al usuario a una sala en particular
   // Sala global, client.id, 5f700330c16a9283347cc2dc
   client.join( uid );
   
   client.on('mensaje-personal', async (payload) => {
      
      await grabarMensaje(payload);

      io.to(payload.para).emit('mensaje-personal', payload);
   });

   client.on('disconnect', () => {
      usuarioDesconectado(uid);
      console.log('Cliente desconectado');
   });

});