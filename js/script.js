document.addEventListener("DOMContentLoaded", function () {
    let seleccionados = [];
    let palabrasCorrectas = [];
    let puntos = 0;

    fetch("./php/obtener_palabras.php")
        .then(response => response.json())
        .then(data => {
            generarSopaDeLetras(data);
            mostrarListaPalabras(data);
            palabrasCorrectas = data.map(p => p.toUpperCase()); //Guardamos palabras en mayúsculas
        });
    
    function generarSopaDeLetras(palabras) {
        const TAMAÑO = 10; //Tamaño de la sopa de letras (10x10)
        let sopa = Array.from({length: TAMAÑO}, () => Array(TAMAÑO).fill(""));

        //Insertar palabras en la sopa
        palabras.forEach(palabra => {
            colocarPalabraEnSopa(sopa, palabra.toUpperCase());
        });

        //Rellenar espacios vacíos con letras aleatorias
        for (let i = 0; i < TAMAÑO; i++) {
            for (let j = 0; j < TAMAÑO; j++) {
                if (sopa[i][j] === "") {
                    sopa[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }

        dibujarSopa(sopa);
    }

    //Dibujar la sopa de letras en la página
    function dibujarSopa(sopa) {
        const CONTENEDOR = document.getElementById("sopa");
        CONTENEDOR.innerHTML = "";
        CONTENEDOR.style.gridTemplateColumns = `repeat(${sopa.length}, 40px)`;

        for (let i = 0; i < sopa.length; i++) {
            for (let j = 0; j < sopa[i].length; j++) {
                let celda = document.createElement("div");
                celda.classList.add("cell");
                celda.textContent = sopa[i][j];
                celda.dataset.fila = i;
                celda.dataset.columna = j;
                celda.addEventListener("click", seleccionarLetra);
                CONTENEDOR.appendChild(celda);
            }
        }
    }

    function seleccionarLetra(event) {
        let celda = event.target;
        let fila = parseInt(celda.dataset.fila);
        let columna = parseInt(celda.dataset.columna);

        //Verificar si la celda ya está seleccionada
        if (celda.classList.contains("seleccionada")) {
            celda.classList.remove("seleccionada");
            seleccionados = seleccionados.filter(sel => !(sel.fila == celda.dataset.fila && celda.dataset.columna));
        } else {
            celda.classList.add("seleccionada");
            seleccionados.push({
                letra: celda.textContent,
                fila: celda.dataset.fila,
                columna: celda.dataset.columna
            });
        }

        verificarPalabra();
    }

    function verificarPalabra() {
        if (seleccionados.length < 2) return;
        
        let palabraFormada = seleccionados.map(celda => celda.letra).join("");
        let esValida = palabrasCorrectas.includes(palabraFormada);

        if (esValida && esEnLineaRecta()) {
            alert(`¡Encontraste la palabra: ${palabraFormada}`);

            seleccionados.forEach(celda => {
                document.querySelector(`.cell[data-fila='${celda.fila}'][data-columna='${celda.columna}']`).classList.add("found");
            });

            puntos += palabraFormada.length;
            document.getElementById("puntos").textContent = `Puntos: ${puntos}`;
            seleccionados = [];
        }
    }

    function esEnLineaRecta() {
        if (seleccionados.length < 2) return false;

        let filas = seleccionados.map(celda => celda.fila);
        let columnas = seleccionados.map(celda => celda.columna);

        let mismaFila = filas.every((val, _, arr) => val === arr[0]);
        let mismaColumna = columnas.every((val, _, arr) => val === arr[0]);

        let diagonal = filas.every((val, i) => val - filas[0] === columnas[i] - columnas[0]) ||
                       filas.every((val, i) => val - filas[0] === columnas[0] - columnas[i]);

        return mismaFila || mismaColumna || diagonal;
    }

    function colocarPalabraEnSopa(sopa, palabra) {
        const TAMAÑO = sopa.length;
        let colocada = false;

        while (!colocada) {
            let fila = Math.floor(Math.random() * TAMAÑO);
            let columna = Math.floor(Math.random() * TAMAÑO);
            let direccion = Math.random() < 0.5 ? "H" : "V"; //Horizontal o Vertical

            if (puedeColocarse(sopa, palabra, fila, columna, direccion)) {
                for (let i = 0; i < palabra.length; i++) {
                    if (direccion === "H") {
                        sopa[fila][columna + i] = palabra[i];
                    } else {
                        sopa[fila + i][columna] = palabra[i];
                    }
                }

                colocada = true;
            }
        }
    }

    function puedeColocarse(sopa, palabra, fila, columna, direccion) {
        const TAMAÑO = sopa.length;
        if (direccion === "H" && columna + palabra.length > TAMAÑO) return false;
        if (direccion === "V" && fila + palabra.length > TAMAÑO) return false;

        for (let i = 0; i < palabra.length; i++) {
            if (direccion === "H" && sopa[fila][columna + i] !== "") return false;
            if (direccion === "V" && sopa[fila + i][columna] !== "") return false;
        }

        return true;
    }

    function mostrarListaPalabras(palabras) {
        const LISTA = document.getElementById("lista-palabras");
        LISTA.innerHTML = "";
        palabras.forEach(palabra => {
            let li = document.createElement("li");
            li.textContent = palabra.toUpperCase();
            LISTA.appendChild(li);
        });

        const contadorPuntos = document.createElement("h3");
        contadorPuntos.id = "puntos";
        contadorPuntos.textContent = "Puntos: 0";
        document.body.appendChild(contadorPuntos);
    }


});