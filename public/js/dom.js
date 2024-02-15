async function putJSON(data) {
    //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
    
  try {
      const response = await fetch("/login", {
          method: "POST", 
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });
      
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result);
      
      if (result.validar == false) {
        Swal.fire({
          title: "Los Datos son incorrectos",
          text: "Intente nuevamente",
          icon: "error"
        });
      } else {
          //Envio el formularia desde dom para cambiar de pagina
          //Podria usar tambien un changeScreen()
          if (result.admin == 1) {
              document.getElementById("form-admin").submit()
          }else{
              document.getElementById("form-login").submit()
          }
      }
  }
  
  catch (error) {
    console.error("Error:", error);
  }
}
  
//Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
function login() {
  //Leo los datos del input
  let usuario = document.getElementById("usuarioId").value
  let contraseña = document.getElementById("passwordId").value

  //Creo un objeto de forma instantanea
  let data = {
    usuario: usuario,
    contraseña: contraseña
  }

  //data es el objeto que le paso al back
  putJSON(data)
}


// -----------------------------------------------------------------


let cart = [];
let cartItems = 0;

function addToCart(productName, bodega, price) {
  // Buscar si el producto ya está en el carrito
  let existingItem = cart.find(item => item.name === productName && item.bodega === bodega);

  if (existingItem) {
    // Si ya está, incrementar la cantidad en lugar de agregar uno nuevo
    existingItem.quantity++;
  } else {
    // Si no está, agregar uno nuevo al carrito
    cart.push({ name: productName, bodega: bodega, price: price, quantity: 1 });
  }

  updateCart();
  cartItems++;
  updateCartCounter();
}

function updateCart() {
  let cartItemsElement = document.getElementById('cart-items');
  let cartTotalElement = document.getElementById('cart-total');

  // Limpiar el carrito
  cartItemsElement.innerHTML = '';

  // Calcular el total
  let total = 0;

  // Mostrar elementos en el carrito
  cart.forEach(item => {
    let listItem = document.createElement('li');
    // Crear un span para el nombre del producto, cantidad y precio
    let itemInfoSpan = document.createElement('span');
    itemInfoSpan.textContent = `${item.name}, ${item.bodega} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
    listItem.appendChild(itemInfoSpan);

    // Agregar botón de eliminar producto
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('btn-cart');
    deleteButton.onclick = function() {
      removeFromCart(item.name);
    };
    listItem.appendChild(deleteButton);

    cartItemsElement.appendChild(listItem);

    total += item.price * item.quantity;
  });

  // Actualizar el total
  cartTotalElement.textContent = total.toFixed(2);
}


function removeFromCart(productName) {
  // Buscar el producto en el carrito
  let index = cart.findIndex(item => item.name === productName);

  if (index !== -1) {
    // Si se encuentra, disminuir la cantidad o eliminar el producto si es el último
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }

    // Actualizar el carrito
    updateCart();
    cartItems--;
    updateCartCounter();
  }
}

function updateCartCounter() {
  const cartCounter = document.getElementById('cart-counter');
  cartCounter.textContent = cartItems;
}

function clearCart() {
  cart = [];
  updateCart();
  cartItems = 0
  updateCartCounter();
}



// -----------------------------------------------------------------


async function mostrarTablaCF(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/tablaCF", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log(result.cf[0].bodega)

    let tablaCF = document.getElementById("tablaAdmin")
    let stringTablaCF = ""
    stringTablaCF += `
      <h3>Consumidor Final</h3>
      <table class="table" id="tablaAdmin">
        <thead>
            <tr>
                <th scope ="col">Nombre Producto</th>
                <th scope ="col">Bodega</th>
                <th scope ="col">Precio</th>
            </tr>
        </thead>
        <tbody>`

    for(let i = 0; i < result.cf.length; i++){
      stringTablaCF += ` <tr>
            <td>${result.cf[i].nombreProducto}</td>
            <td>${result.cf[i].bodega}</td>
            <td>${result.cf[i].precio}</td>
        </tr>`;
    }
    
    tablaCF.innerHTML = stringTablaCF + `</tbody> </table>`;
}

catch (error) {
  console.error("Error:", error);
}
}


function tablaCF() {
  mostrarTablaCF()
}


async function mostrarTablaV(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/tablaV", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log(result.v[0].bodega)

    let tablaV = document.getElementById("tablaAdmin")
    let stringTablaV = ""
    stringTablaV += `
      <h3>Vinoteca</h3>
      <table class="table" id="tablaAdmin">
        <thead>
            <tr>
                <th scope ="col">Nombre Producto</th>
                <th scope ="col">Bodega</th>
                <th scope ="col">Precio</th>
            </tr>
        </thead>
        <tbody>`

    for(let i = 0; i < result.v.length; i++){
      stringTablaV += ` <tr>
            <td>${result.v[i].nombreProducto}</td>
            <td>${result.v[i].bodega}</td>
            <td>${result.v[i].precio}</td>
        </tr>`;
    }
    
    tablaV.innerHTML = stringTablaV + `</tbody> </table>`;
}

catch (error) {
  console.error("Error:", error);
}
}


function tablaV() {
  mostrarTablaV()
}


async function mostrarTablaDis(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/tablaDis", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log(result.dis[0].bodega)

    let tablaDis = document.getElementById("tablaAdmin")
    let stringTablaDis = ""
    stringTablaDis += `
      <h3>Distribuidora</h3>
      <table class="table" id="tablaAdmin">
        <thead>
            <tr>
                <th scope ="col">Nombre Producto</th>
                <th scope ="col">Bodega</th>
                <th scope ="col">Precio</th>
            </tr>
        </thead>
        <tbody>`

    for(let i = 0; i < result.dis.length; i++){
      stringTablaDis += ` <tr>
            <td>${result.dis[i].nombreProducto}</td>
            <td>${result.dis[i].bodega}</td>
            <td>${result.dis[i].precio}</td>
        </tr>`;
    }
    
    tablaDis.innerHTML = stringTablaDis + `</tbody> </table>`;
}

catch (error) {
  console.error("Error:", error);
}
}

function tablaDis() {
  mostrarTablaDis()
}


// -------------------------------------------------


async function fetchModificarPrecios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/modificarPrecio", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de modificar precio funciona!')
}

catch (error) {
  console.error("Error:", error);
}
}


function modificarPrecio() {

  let id_lista_precioMod = document.getElementById("selectLista").value
  let productoMod = document.getElementById("selectProductos").value
  let precioMod = document.getElementById("nuevoPrecio").value

  if (nuevoPrecio.value.trim() === '') {
    Swal.fire({
      title: "Administrador",
      text: "Por favor completa todos los campos.",
      icon: "warning"
    });
    return; // Detener la ejecución de la función si hay campos vacíos
  }

  let precioModificado = {
    id_lista_precio: id_lista_precioMod,
    producto: productoMod,
    precio: precioMod
  }

  console.log(precioModificado)

  fetchModificarPrecios(precioModificado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}


async function fetchAgregarProductos(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/agregarProducto", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de agregart producto funciona!')
}

catch (error) {
  console.error("Error:", error);
}
}


function agregarProducto() {

  let productoNuevo = document.getElementById("nombreProducto").value
  let bodegaNueva = document.getElementById("bodega").value
  let id_lista_precioNuevo = document.getElementById("selectLista2").value

  if (nombreProducto.value.trim() === '' || bodega.value.trim() === '') {
    Swal.fire({
      title: "Administrador",
      text: "Por favor completa todos los campos.",
      icon: "warning"
    });
    return; // Detener la ejecución de la función si hay campos vacíos
  }

  let productoAgregado = {
    producto: productoNuevo,
    bodega: bodegaNueva,
    id_lista_precio: id_lista_precioNuevo,

  }

  console.log(productoAgregado)

  fetchAgregarProductos(productoAgregado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function fetchAgregarPrecios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/agregarPrecio", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
      },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de agregar precio funciona!')
}

catch (error) {
  console.error("Error:", error);
}
}

function agregarPrecio() {

  let id_lista_precioNuevo = document.getElementById("selectLista2").value
  let productoNuevo = document.getElementById("selectProductos2").value
  let precioNuevo = document.getElementById("nuevoPrecio2").value

  if (nuevoPrecio2.value.trim() === '') {
    Swal.fire({
      title: "Administrador",
      text: "Por favor completa todos los campos.",
      icon: "warning"
    });
    return; // Detener la ejecución de la función si hay campos vacíos
  }

  let precioAgregado = {
    id_lista_precio: id_lista_precioNuevo,
    producto: productoNuevo,
    precio: precioNuevo
  }

  console.log(precioAgregado)

  fetchAgregarPrecios(precioAgregado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function mostrarTablaProductos(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/tablaProductos", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log(result.productos[0].bodega)

    let tablaProductos = document.getElementById("tablaProductos")
    let stringTablaProductos = ""
    stringTablaProductos += `
      <table class="table" id="tablaProductos">
        <thead>
            <tr>
                <th scope ="col">ID</th>
                <th scope ="col">Nombre Producto</th>
                <th scope ="col">Bodega</th>
            </tr>
        </thead>
        <tbody>`

    for(let i = 0; i < result.productos.length; i++){
      stringTablaProductos += ` <tr>
            <td>${result.productos[i].id_producto}</td>
            <td>${result.productos[i].nombreProducto}</td>
            <td>${result.productos[i].bodega}</td>
        </tr>`;
    }
    
    tablaProductos.innerHTML = stringTablaProductos + `</tbody> </table>`;
}

catch (error) {
  console.error("Error:", error);
}
}

function tablaProductos() {
  mostrarTablaProductos()
}

async function mostrarTablaUsuarios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/tablaUsuarios", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log(result.usuarios[0].bodega)

    let tablaUsuarios = document.getElementById("tablaUsuarios")
    let stringTablaUsuarios = ""
    stringTablaUsuarios += `
      <table class="table" id="tablaUsuarios">
        <thead>
            <tr>
                <th scope ="col">ID</th>
                <th scope ="col">Nombre Cliente</th>
                <th scope ="col">Usuario</th>
                <th scope ="col">Contraseña</th>
                <th scope ="col">Es Administrador</th>
                <th scope ="col">Lista Precio</th>
            </tr>
        </thead>
        <tbody>`

    for(let i = 0; i < result.usuarios.length; i++){

      let admin = ''
      if(result.usuarios[i].es_admin == 1){
        admin = 'Si'
      } else{
        admin = 'No'
      }

      let lista = '';
      if (result.usuarios[i].id_lista_precio == 1) {
        lista = 'Consumidor_final';
      } else if (result.usuarios[i].id_lista_precio == 2) {
        lista = 'Vinoteca';
      } else if (result.usuarios[i].id_lista_precio == 3) {
        lista = 'Distribuidora';
      }

      stringTablaUsuarios += ` <tr>
            <td>${result.usuarios[i].id_cliente}</td>
            <td>${result.usuarios[i].nombreCliente}</td>
            <td>${result.usuarios[i].nombreUsuario}</td>
            <td>${result.usuarios[i].contraseña}</td>
            <td>${admin}</td>
            <td>${lista}</td>

        </tr>`;
    }
    
    tablaUsuarios.innerHTML = stringTablaUsuarios + `</tbody> </table>`;


}

catch (error) {
  console.error("Error:", error);
}
}

function tablaUsuarios() {
  mostrarTablaUsuarios()
}


async function fetchLeerUsuarios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
  try {
    const response = await fetch("/leerUsuarios", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    

    document.getElementById("nombreMod").value = result.usuarios.nombreCliente
    document.getElementById("usuarioMod").value = result.usuarios.nombreUsuario
    document.getElementById("contraseñaMod").value = result.usuarios.contraseña
    document.getElementById("selectAdmin").value = result.usuarios.es_admin
    document.getElementById("selectLista3").value = result.usuarios.id_lista_precio
    console.log('El fetch de leer usuario funciona!')
  }

  catch (error) {
    console.error("Error:", error);
  }
}

function leerUsuarios() {

  let id_usuario = document.getElementById("selectUsuarios").value

  let usuario = {
    id: id_usuario,
  }

  console.log(usuario)

  fetchLeerUsuarios(usuario)
}


async function fetchModificarUsuarios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
  try {
    const response = await fetch("/modificarUsuario", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de modificar usuario funciona!')
  }

  catch (error) {
    console.error("Error:", error);
  }
}


function modificarUsuarios() {

  let id_usuario = document.getElementById("selectUsuarios").value
  let nombreMod = document.getElementById("nombreMod").value
  let usuarioMod = document.getElementById("usuarioMod").value
  let contraseñaMod = document.getElementById("contraseñaMod").value
  let adminMod = document.getElementById("selectAdmin").value
  let listaMod = document.getElementById("selectLista3").value

  if (nombreMod.value.trim() === '' || usuarioMod.value.trim() === '' || contraseñaMod.value.trim() === '') {
    Swal.fire({
      title: "Administrador",
      text: "Por favor completa todos los campos.",
      icon: "warning"
    });
    return; // Detener la ejecución de la función si hay campos vacíos
  }

  let usuarioModificado = {
    id: id_usuario,
    nombre: nombreMod,
    usuario: usuarioMod,
    contraseña: contraseñaMod,
    admin: adminMod,
    lista: listaMod
  }

  console.log(usuarioModificado)

  fetchModificarUsuarios(usuarioModificado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function fetchEliminarUsuarios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
  try {
    const response = await fetch("/eliminarUsuario", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de eliminar usuario funciona!')
  }

  catch (error) {
    console.error("Error:", error);
  }
}


function eliminarUsuarios() {

  let id_usuario = document.getElementById("selectUsuarios2").value

  let usuarioEliminado = {
    id: id_usuario
  }

  console.log(usuarioEliminado)

  fetchEliminarUsuarios(usuarioEliminado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function fetchCrearUsuarios(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/crearUsuario", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de crear usuarios funciona!')
}

catch (error) {
  console.error("Error:", error);
}
}


function crearUsuarios() {

  let nombreNuevo = document.getElementById("nuevoNombre").value
  let usuarioNuevo = document.getElementById("nuevoUsuario").value
  let contraseñaNuevo = document.getElementById("nuevaContraseña").value
  let adminNuevo = document.getElementById("selectAdminNuevo").value
  let listaNuevo = document.getElementById("selectLista4").value


  if (nuevoNombre.value.trim() === '' || nuevoUsuario.value.trim() === '' || nuevaContraseña.value.trim() === '') {
    Swal.fire({
      title: "Administrador",
      text: "Por favor completa todos los campos.",
      icon: "warning"
    });
    return; // Detener la ejecución de la función si hay campos vacíos
  }

  let clienteNuevo = {
    nombre: nombreNuevo,
    usuario: usuarioNuevo,
    contraseña: contraseñaNuevo,
    admin: adminNuevo,
    lista: listaNuevo
  }

  console.log(clienteNuevo)

  fetchCrearUsuarios(clienteNuevo)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function fetchEliminarPorProducto(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
  try {
    const response = await fetch("/porProducto", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de eliminar por producto funciona!')
  }

  catch (error) {
    console.error("Error:", error);
  }
}


function eliminarPorProducto() {

  let id_producto = document.getElementById("selectProductos3").value

  let productoEliminado = {
    id: id_producto
  }

  console.log(productoEliminado)

  fetchEliminarPorProducto(productoEliminado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

async function fetchEliminarPorBodega(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
  try {
    const response = await fetch("/porBodega", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de eliminar por bodega funciona!')
  }

  catch (error) {
    console.error("Error:", error);
  }
}


function eliminarPorBodega() {

  let bodegaEliminada = document.getElementById("selectProductos4").value

  let productoEliminado = {
    bodega: bodegaEliminada
  }

  console.log(productoEliminado)

  fetchEliminarPorBodega(productoEliminado)
  Swal.fire({
    position: "middle",
    icon: "success",
    title: "Los cambios han sido guardados",
    showConfirmButton: false,
    timer: 1700
  });
}

// -------------------------------------

function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Cerrar el dropdown si se hace clic fuera de él
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//------------------------

function changeImage() {
  document.getElementById('flecha').src = '/img/caret-abajo-blanca.png';
}

function resetImage() {
  document.getElementById('flecha').src = '/img/caret-abajo.png';
}

//--------------------------------------------------

async function fetchEnviarCorreo(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    
  
try {
    const response = await fetch("/enviarCorreo", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);
    console.log('El fetch de enviar correo funciona!')

}

catch (error) {
  console.error("Error:", error);
}
}

function realizarPedido() {
  let productos = document.querySelectorAll('#cart-items li span');
  let total = document.getElementById('cart-total').textContent
  let data = {
    productos: [],
    total
  };

  for (let i = 0; i < productos.length; i++) {
    data.productos.push(productos[i].textContent);
  }

  fetchEnviarCorreo(data);
  changeScreen()
}


// ------------------------

function changeScreen() {
  const pagPrincipal = document.getElementById("pag-principal");
  const mailEnviado = document.getElementById("mailEnviado");
  
  if (pagPrincipal.style.display !== "none") {
      pagPrincipal.classList.add("fade-out");
      mailEnviado.classList.add("fade-in");
      mailEnviado.style.display = "flex";
      pagPrincipal.style.display = "none";
      // setTimeout(() => {
          
      // }, 500); // Espera 0.5 segundos antes de ocultar la página principal
  } else {
      pagPrincipal.classList.remove("fade-out");
      mailEnviado.classList.remove("fade-in");
      pagPrincipal.style.display = "";
      mailEnviado.style.display = "none";

      // setTimeout(() => {
      // }, 500); // Espera 0.5 segundos antes de ocultar la pantalla de "Pedido Enviado"
  }
}


// -----------------------------


function buscarPorContenido() {
  let resultado = document.getElementById("search-input").value.toUpperCase();
  let productos = document.querySelectorAll('.product');
  let noResultsDiv = document.getElementById('no-results');

  let encontrados = false;

  if (resultado.length >= 1) {
    for (let i = 0; i < productos.length; i++){
      let nombreProducto = productos[i].querySelector('.nombreProducto').innerText.toUpperCase();
      let nombreBodega = productos[i].querySelector('.nombreBodega').innerText.toUpperCase();

      if (nombreProducto.includes(resultado) || nombreBodega.includes(resultado)) {
        productos[i].style.display = 'block'; // Mostrar el producto si coincide con la búsqueda
        encontrados = true;
      } else {
        productos[i].style.display = 'none'; // Ocultar el producto si no coincide con la búsqueda
      }
    };
  } else {
    // Si no hay texto en el campo de búsqueda, mostrar todos los productos
    for (let i = 0; i < productos.length; i++){
      productos[i].style.display = 'block';
    };
    encontrados = true;
  }
  if (encontrados == true) {
    noResultsDiv.style.display = 'none'; // Ocultar el elemento si se encontraron resultados
  } else {
    noResultsDiv.style.display = 'block'; // Mostrar el elemento si no se encontraron resultados
  }
}