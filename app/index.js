// Importar el módulo 'express'
const express = require('express');
// Crear una aplicación de Express
const app = express();
// Importar el esquema de usuario
const User = require('./schemas/users');
// Importar el módulo 'mongoose'
const mongoose = require('mongoose');
// Importar el módulo 'dotenv'
const dotenv = require('dotenv');

// Establecer el puerto de la aplicación (si existe un puerto en el entorno, usar ese; de lo contrario, usar el puerto 3000)
app.set('port', (process.env.PORT || 3000));

// Importar el módulo 'dotenv' para leer las variables de entorno
dotenv.config();

//Conectarse a la base de datos
const url = "mongodb://"
    +process.env.DBUSER+":"+process.env.DBPASS+"@"
    +process.env.HOST+"/"+process.env.DBNAME;
console.log(url);
mongoose.connect(url, {useNewUrlParser: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log("Connected to database");
});

// Usar el middleware 'express.json' para parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Ruta para la página principal
app.get('/', function(req, res) {
    res.send('Hello World!');
});

// Ruta para publicar datos
app.post('/postdata', function(req, res) {
    // Obtener el correo electrónico y el nombre de usuario del cuerpo de la solicitud
    var mail = req.body.mail;
    var username = req.body.username;
    // Crear un nuevo objeto de usuario con el nombre de usuario y el correo electrónico
    var user = new User({
        username: username,
        mail: mail
    });
    // Guardar el usuario en la base de datos
    user.save(function(err) {
        if (err) {
            // Si hay un error, mostrar un mensaje en la consola y enviar una respuesta 'Error'
            console.log(err);
            res.send('Error');
        } else {
            // Si no hay errores, enviar una respuesta 'Saved'
            res.send('Saved');
        }
    });
});

// Ruta para actualizar datos
app.post('/updatedata', function(req, res) {
    var mail = req.body.mail;
    var username = req.body.username;
    // Actualizar el usuario en la base de datos, primero es filtro luego update
    User.updateOne({username: username}, {mail: mail}, function(err, user) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.send('Updated');
        }
    });
});

// Ruta para eliminar datos
app.post('/deletedata', function(req, res) {
    var username = req.body.username;
    // Eliminar el usuario de la base de datos
    User.findOneAndDelete({username: username}, function(err, user) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.send('Deleted');
        }
    });
});

app.get('/getdata', async function(req, res) {
    var username = req.body.username;
    // Obtener el usuario de la base de datos
    var user = await User.findOne({username: username});
    res.send(user);
});

// Iniciar la aplicacion
var server = app.listen(app.get("port"), function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Node.js API app listening at http://%s:%s", host, port)

})