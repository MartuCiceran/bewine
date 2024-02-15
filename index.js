/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const session = require('express-session'); //Para usar variables de sesión
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos
const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const nodemailer = require('nodemailer');
const Swal = require('sweetalert2')


app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/

app.get('/', function(req, res)
{
    console.log(req.query);
    res.render('login', null);
});


app.post('/login', async function(req, res)
{
    //Petición POST con URL = "/login"
    console.log("Soy un pedido POST /login", req.body);
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Clientes WHERE nombreUsuario = "${req.body.usuario}" AND contraseña = "${req.body.contraseña}"`)
    //Chequeo el largo del vector a ver si tiene datos
    if (respuesta.length > 0) {
        //Armo un objeto para responder
        // console.log(respuesta)
        console.log(respuesta[0].es_admin)
        req.session.usuario = req.body.usuario;
        req.session.nombre = respuesta[0].nombreCliente
        req.session.id_lista = respuesta[0].id_lista_precio
        console.log(req.session.usuario)
        res.send({validar: true, admin : respuesta[0].es_admin})    
    }
    else{
        // console.log("else del index.js")
        res.send({validar:false})    
    }
    
});

app.post('/pagPrincipal', async function(req, res)
{
    console.log("Soy un pedido POST /pagPrincipal", req.query);

    let id_lista_precio = await MySQL.realizarQuery(`SELECT id_lista_precio FROM Clientes WHERE nombreUsuario = '${req.session.usuario}'`)

    // console.log('el id lista es: ', id_lista_precio)

    let tabla = '';
    if (id_lista_precio && id_lista_precio.length > 0) {
        id_lista_precio = id_lista_precio[0].id_lista_precio;

        
        if (id_lista_precio == 1) {
            tabla = 'Consumidor_final';
        } else if (id_lista_precio == 2) {
            tabla = 'Vinoteca';
        } else if (id_lista_precio == 3) {
            tabla = 'Distribuidora';
        }
    }

    // console.log(tabla)

    let productos = await MySQL.realizarQuery(`SELECT Productos.nombreProducto,  Productos.bodega, ${tabla}.precio FROM Productos INNER JOIN ${tabla} ON Productos.id_producto = ${tabla}.id_producto WHERE ${tabla}.id_lista_precio = ${id_lista_precio};`);
    // console.log('productos', productos);

    res.render('pag-principal', { productos: productos });
});



app.post('/administrador', async function(req, res)
{
    console.log("Soy un pedido POST /administrador", req.query);
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Productos`);
    // console.log(respuesta) 

    let clientes = await MySQL.realizarQuery(`SELECT * FROM Clientes`);
    // console.log(clientes) 

    let bodegas = await MySQL.realizarQuery(`SELECT DISTINCT bodega FROM Productos`);
    // console.log(respuesta) 

    res.render('administrador', {productos : respuesta, usuarios: clientes, bodegas: bodegas});
});


app.post('/tablaCF', async function(req, res)
{
    console.log("Soy un pedido POST /tablaCF", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT Productos.nombreProducto,  Productos.bodega, Consumidor_final.precio FROM Productos INNER JOIN Consumidor_final ON Productos.id_producto = Consumidor_final.id_producto WHERE Consumidor_final.id_lista_precio = 1;`);
    // console.log(respuesta)
    
    res.send({cf : respuesta});
});

app.post('/tablaV', async function(req, res)
{
    console.log("Soy un pedido POST /tablaV", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT Productos.nombreProducto,  Productos.bodega, Vinoteca.precio FROM Productos INNER JOIN Vinoteca ON Productos.id_producto = Vinoteca.id_producto WHERE Vinoteca.id_lista_precio = 2;`);
    // console.log(respuesta)
    
    res.send({v : respuesta});
});


app.post('/tablaDis', async function(req, res)
{
    console.log("Soy un pedido POST /tablaDis", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT Productos.nombreProducto,  Productos.bodega, Distribuidora.precio FROM Productos INNER JOIN Distribuidora ON Productos.id_producto = Distribuidora.id_producto WHERE Distribuidora.id_lista_precio = 3;`);
    // console.log(respuesta)
    
    res.send({dis : respuesta});
});


app.post('/modificarPrecio', async function(req, res)
{
    console.log("Soy un pedido POST /modificarPrecio", req.query);

    let tabla = '';
    if ( req.body.id_lista_precio == 1) {
        tabla = 'Consumidor_final';
    } else if (req.body.id_lista_precio == 2) {
        tabla = 'Vinoteca';
    } else if (req.body.id_lista_precio == 3) {
        tabla = 'Distribuidora';
    }

    let respuesta = await MySQL.realizarQuery(`UPDATE ${tabla} SET precio = ${req.body.precio} WHERE id_producto = ${req.body.producto}`)
    
    res.send({preciosMod: respuesta})
    
});


app.post('/agregarProducto', async function(req, res)
{
    console.log("Soy un pedido POST /agregarProducto", req.query);

    let respuesta = await MySQL.realizarQuery(`INSERT INTO Productos(nombreProducto, bodega) VALUES("${req.body.producto}", "${req.body.bodega}")`)
    
    res.send({productoAgregado: respuesta})
    
});

app.post('/agregarPrecio', async function(req, res)
{
    console.log("Soy un pedido POST /agregarPrecio", req.query);
    
    let tabla = '';
    if ( req.body.id_lista_precio == 1) {
        tabla = 'Consumidor_final';
    } else if (req.body.id_lista_precio == 2) {
        tabla = 'Vinoteca';
    } else if (req.body.id_lista_precio == 3) {
        tabla = 'Distribuidora';
    }

    let respuesta = await MySQL.realizarQuery(`INSERT INTO ${tabla}(id_producto, precio, id_lista_precio) VALUES(${req.body.producto}, ${req.body.precio}, ${req.body.id_lista_precio})`)
    
    res.send({precioAgregado: respuesta})
    
});



app.post('/tablaProductos', async function(req, res)
{
    console.log("Soy un pedido POST /tablaProductos", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Productos;`);
    // console.log(respuesta)
    
    res.send({productos : respuesta});
});


app.post('/tablaUsuarios', async function(req, res)
{
    console.log("Soy un pedido POST /tablaUsuarios", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Clientes;`);
    // console.log(respuesta)
    
    res.send({usuarios : respuesta});
});


app.post('/leerUsuarios', async function(req, res)
{
    console.log("Soy un pedido POST /leerUsuarios", req.query);

    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Clientes WHERE id_cliente = ${req.body.id};`);
    // console.log(respuesta)
    
    res.send({usuarios : respuesta[0]});
});


app.post('/modificarUsuario', async function(req, res)
{
    console.log("Soy un pedido POST /modificarUsuario", req.query);

    let tabla = '';
    if ( req.body.lista == 1) {
        tabla = 'Consumidor_final';
    } else if (req.body.lista == 2) {
        tabla = 'Vinoteca';
    } else if (req.body.lista == 3) {
        tabla = 'Distribuidora';
    }

    let respuesta = await MySQL.realizarQuery(`UPDATE Clientes SET nombreCliente = '${req.body.nombre}', nombreUsuario = '${req.body.usuario}', contraseña = '${req.body.contraseña}', es_admin = ${req.body.admin}, id_lista_precio = ${req.body.lista} WHERE id_cliente = ${req.body.id}`)
    
    res.send({usuarioMod: respuesta})
    
});

app.post('/crearUsuario', async function(req, res)
{
    console.log("Soy un pedido POST /crearUsuario", req.query);

    let respuesta = await MySQL.realizarQuery(`INSERT INTO Clientes(nombreCliente, id_lista_precio, nombreUsuario, contraseña, es_admin) VALUES("${req.body.nombre}", ${req.body.lista}, "${req.body.usuario}", "${req.body.contraseña}", ${req.body.admin})`)
    
    res.send({productoAgregado: respuesta})
    
});

app.post('/eliminarUsuario', async function(req, res)
{
    console.log("Soy un pedido POST /eliminarUsuario", req.query);

    let respuesta = await MySQL.realizarQuery(`DELETE FROM Clientes WHERE id_cliente = ${req.body.id}`)
    
    res.send({usuarioEliminado: respuesta})
    
});

app.post('/porProducto', async function(req, res)
{
    console.log("Soy un pedido POST /porProducto", req.query);

    let respuesta = await MySQL.realizarQuery(`DELETE FROM Productos WHERE id_producto = ${req.body.id}`)
    
    res.send({productoEliminado: respuesta})
    
});

app.post('/porBodega', async function(req, res)
{
    console.log("Soy un pedido POST /porBodega", req.query);

    let respuesta = await MySQL.realizarQuery(`DELETE FROM Productos WHERE bodega = "${req.body.bodega}"`)
    
    res.send({bodegaEliminada: respuesta})
    
});

app.post('/enviarCorreo', async function(req, res)
{
    console.log("Soy un pedido POST /enviarCorreo", req.query);

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'vinosrami@gmail.com',
            pass: 'lehm tvlj expd slkr'
        }
    }
    
    const transporter = nodemailer.createTransport(config)

    const mensaje = {
        from: 'vinosrami@gmail.com',
        to: 'vinosrami@gmail.com',
        subject: 'Pedido de la tienda online',
        text: 'Envio el correo utilizando nodemailer',
        html: `<html>
        <head>
        <style>

        @media screen and (max-width: 600px) {
            #container {
                flex-direction: column;
            }
        
            #img-bodegas,
            #div-login {
                width: 100%;
            }
        } 
    .pedido{
        margin-top: 20px;
        padding: 20px;
        background-color: #891616;
        overflow-y: auto;
        max-height: 500px;
        color: #FFFDEF;
        font-size: 20px;
    }

    .items{
        list-style-type: none;
        padding: 0;
    }

    .items li{
        border-bottom: 1px solid #ccc;
        padding: 10px;
    }

    p {
        padding: 10px;
    }

</style>
        </head>
        <body>
            <div class="pedido">
                <h2>Cliente: ${req.session.nombre}</h2>
                <h3>Pedido:</h3>
                <ul class="items">
                    ${req.body.productos.map(producto => `<li>${producto}</li>`).join('')}
                </ul>
                <p>Total: $ ${req.body.total}</p>
            </div>
        </body>
        
        </html>`
    }
    const info = await transporter.sendMail(mensaje);
    
    console.log(info)


    // console.log(req.body)

    res.send({productos : req.body.data});
    
});

