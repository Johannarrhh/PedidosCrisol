
const productos = [
  { codigo: "2120", nombre: "3 LECHES 20P", precio: 18000 },
  { codigo: "2118", nombre: "AMAPOLA 20P", precio: 20000 },
  { codigo: "2010", nombre: "AMOR 20P", precio: 28000 },
  { codigo: "2008", nombre: "BISCOCHO PURE LUCUMA 20P", precio: 20000 },
 
];


function cargarProductos() {
  const select = document.getElementById("productoSelect");
  productos.forEach(producto => {
    const opcion = document.createElement("option");
    opcion.value = producto.codigo;
    opcion.textContent = `${producto.nombre} - $${producto.precio.toLocaleString()}`;
    select.appendChild(opcion);
  });
}


document.getElementById("pedidoForm").addEventListener("submit", function(e) {
  e.preventDefault();

 
  const datosPedido = {
    fecha: document.getElementById("fechaRetiro").value,
    hora: document.getElementById("horaRetiro").value,
    nombre: document.getElementById("clienteNombre").value,
    telefono: document.getElementById("clienteTelefono").value,
    producto: document.getElementById("productoSelect").value,
    decoracion: document.getElementById("decoracion").value,
    dedicatoria: document.getElementById("dedicatoria").value,
    boleta: document.getElementById("boleta").value,
    observaciones: document.getElementById("observaciones").value,
    local: document.getElementById("local").value
   
  };

  console.log("Pedido recibido:", datosPedido);


  document.getElementById("mensajeConfirmacion").style.display = "block";

 
  this.reset();
});


cargarProductos();
function generarPDF() {
    const form = document.getElementById("pedidoForm");

    const pedidoResumen = document.createElement("div");
    pedidoResumen.innerHTML = `
        <h2>Resumen del Pedido</h2>
        <p><strong>Producto:</strong> ${document.getElementById("productoSelect").selectedOptions[0].text}</p>
    `;

    html2pdf().from(pedidoResumen).save("pedido_crisol.pdf");
}

function guardarPedido() {
    const producto = document.getElementById("productoSelect");
    const productoNombre = producto.options[producto.selectedIndex].text;

    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const cliente = document.getElementById("cliente").value;
    const telefono = document.getElementById("telefono").value;
    const local = document.getElementById("local").value;
    const decoracion = document.getElementById("decoracion").value;
    const dedicatoria = document.getElementById("dedicatoria").value;
    const observaciones = document.getElementById("observaciones").value;

    const pedidoHTML = `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
            <p><strong>Producto:</strong> ${productoNombre}</p>
            <p><strong>Fecha:</strong> ${fecha} ${hora}</p>
            <p><strong>Cliente:</strong> ${cliente} (${telefono})</p>
            <p><strong>Local:</strong> ${local}</p>
            <p><strong>Decoración:</strong> ${decoracion}</p>
            <p><strong>Dedicatoria:</strong> ${dedicatoria}</p>
            <p><strong>Observaciones:</strong> ${observaciones}</p>
        </div>
    `;

    const historial = document.getElementById("historial");
    historial.innerHTML += pedidoHTML;

    let pedidosGuardados = localStorage.getItem("historialPedidos") || "";
    pedidosGuardados += pedidoHTML;
    localStorage.setItem("historialPedidos", pedidosGuardados);

    const pdfPedido = document.getElementById("pdfPedido");
    const pdfHistorial = document.getElementById("pdfHistorial");

    pdfPedido.innerHTML = `
        <h1 style="color:#800000;">CRISOL - Pedido</h1>
        ${pedidoHTML}
        <hr style="margin:30px 0;">
        <p style="font-size:12px;">Generado automáticamente por sistema de pedidos Crisol</p>
    `;

    pdfHistorial.innerHTML = `
        <h1 style="color:#800000;">Historial de Pedidos</h1>
        ${pedidosGuardados}
    `;

    const pdfFinal = document.createElement("div");
    pdfFinal.appendChild(pdfPedido.cloneNode(true));
    pdfFinal.appendChild(document.createElement("div")).style.pageBreakBefore = "always";
    pdfFinal.appendChild(pdfHistorial.cloneNode(true));

    const nombreArchivo = `Pedido_${cliente.trim().replace(/\s+/g, "_")}.pdf`;
    html2pdf().from(pdfFinal).save(nombreArchivo);
}

window.addEventListener("load", function () {
    const historial = document.getElementById("historial");
    const pedidosGuardados = localStorage.getItem("historialPedidos");
    if (pedidosGuardados) {
        historial.innerHTML = pedidosGuardados;
    }
});

