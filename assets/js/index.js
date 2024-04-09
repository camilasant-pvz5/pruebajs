const imagen = `<div class="loader">
    <svg class="star" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <polygon class="star2" points="8 0 10.3 5.8 16 6.3 12 10.5 13.1 16 8 13.3 2.9 16 4 10.5 0 6.3 5.7 5.8"></polygon>
        <polygon class="star3" points="8 0 10.3 5.8 16 6.3 12 10.5 13.1 16 8 13.3 2.9 16 4 10.5 0 6.3 5.7 5.8"></polygon>
    </svg>
</div>`;

async function mostrarSpinner() {
    spiner.innerHTML = imagen; // para mostrar las estrellas (spinner)
}

async function ocultarSpinner() {
    spiner.innerHTML = ""; //  ocultar las estrellas 
}

const txtInput = document.querySelector("#Pesos");            
const select = document.getElementById("unidad");               
const btnConvertir = document.querySelector("#Buscar");          
const resultado = document.querySelector("#resultado");             
var bandera = 0;

async function getRandomUser() {
    if (txtInput.value != '') {
        bandera = 0;
        mostrarSpinner(); // que aparezcan las estrellas mientras cargan los datos del conversor 
        try {
            var aux = select.value;
            const res = await fetch("https://mindicador.cl/api/" + aux + "/"+ "03-04-2024");
            const data = await res.json();
            console.log(data);
            if (aux == "dolar") {
                let calculo = parseFloat(txtInput.value) * parseFloat(data.serie[0].valor);
                resultado.innerHTML = "$ " + Number(calculo.toFixed(3));
                bandera = 1;
                renderGrafica();
            }
            if (aux == "euro") {
                let calculo = parseFloat(txtInput.value) * parseFloat(data.serie[0].valor);
                resultado.innerHTML = "$ " + Number(calculo.toFixed(3));
                bandera = 1;
                renderGrafica();
            }
            ocultarSpinner(); // que se oculte el spinner despues de cargar los datos 
        } catch (error) {
            alert(error.message);
            ocultarSpinner(); // que se oculten despues de un error 
        }
    }
}

async function getMonedas(parammetro) {
    const endpoint = "https://mindicador.cl/api/" + parammetro;
    const res = await fetch(endpoint);
    const monedas = await res.json();
    return monedas;
}

function prepararConfiguracionParaLaGrafica(monedas) {
    const tipoDeGrafica = "bar";
    const nombresDeLasMonedas = monedas.serie.map((moneda) => {
        const valor = moneda.fecha;
        return valor.slice(0,10);
    });
    const titulo = select.value;
    const colorDeLinea = "#D7AEFB";
    const valores = monedas.serie.map((moneda) => {
        const valor = moneda.valor;
        return Number(valor);
    });

    const config = {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas,
            datasets: [{
                label: titulo,
                backgroundColor: colorDeLinea,
                data: valores
            }]
        }
    };
    return config;
}

async function renderGrafica() {
    if (txtInput.value != '') {
        mostrarSpinner(); // mostrar spinner mientras el graf se carga 
        try {
            const monedas = await getMonedas(select.value);
            const config = prepararConfiguracionParaLaGrafica(monedas);
            const chartDOM = document.getElementById("myChart");
            new Chart(chartDOM, config);
            ocultarSpinner(); // ocultar despues de que la graf se carga 
        } catch (error) {
            alert(error.message);
            ocultarSpinner(); // ocultar en caso de error 
            
        }
    }
}

btnConvertir.addEventListener("click", getRandomUser);
