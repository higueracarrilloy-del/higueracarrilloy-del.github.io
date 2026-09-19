/* =========================================================
   S8 | EVALUACIÓN FINAL
   ACADEMIA DE CIENCIAS DE LA INFORMACIÓN
   SCRIPT PRINCIPAL
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const PUNTAJE_APROBACION = 70;
const STORAGE_KEY = "S8_EVALUACIONES_FINALES";


/* =========================================================
   ESTADO
========================================================= */

let preguntaActual = 0;

let respuestas = [];

let datosAspirante = {
    nombre: "",
    roblox: "",
    rango: "ASPIRANTE",
    especializacion: "GENERAL"
};


/* =========================================================
   UTILIDAD DOM
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   OBTENER BANCO DE PREGUNTAS
========================================================= */

function obtenerPreguntas() {

    if (
        typeof window.preguntas === "undefined" ||
        !Array.isArray(window.preguntas)
    ) {

        console.error(
            "S8 | ERROR: No se encontró window.preguntas."
        );

        return [];
    }

    return window.preguntas;
}


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const banco = obtenerPreguntas();

    console.log(
        "S8 | Banco de preguntas cargado:",
        banco.length
    );

    const cantidad = $("cantidadPreguntas");

    if (cantidad) {
        cantidad.textContent = banco.length;
    }

    if (banco.length === 0) {

        console.error(
            "S8 | ERROR: El banco de preguntas está vacío."
        );
    }

    mostrarPantalla("inicio");
});


/* =========================================================
   CAMBIAR DE PANTALLA
========================================================= */

function mostrarPantalla(id) {

    const pantallas =
        document.querySelectorAll(".screen");

    pantallas.forEach(function (pantalla) {

        pantalla.classList.remove("active");
    });

    const objetivo = $(id);

    if (objetivo) {

        objetivo.classList.add("active");
    }
}


/* =========================================================
   MOSTRAR IDENTIFICACIÓN
========================================================= */

function mostrarIdentificacion() {

    const banco = obtenerPreguntas();

    if (banco.length === 0) {

        alert(
            "No se pudo cargar el banco de preguntas.\n\n" +
            "Verifica data/preguntas.js."
        );

        return;
    }

    mostrarPantalla("identificacion");
}


/* =========================================================
   VOLVER AL INICIO
========================================================= */

function volverInicio() {

    preguntaActual = 0;

    respuestas = [];

    datosAspirante = {
        nombre: "",
        roblox: "",
        rango: "ASPIRANTE",
        especializacion: "GENERAL"
    };

    mostrarPantalla("inicio");
}


/* =========================================================
   COMENZAR EVALUACIÓN
========================================================= */

function comenzarEvaluacion() {

    const nombreInput = $("nombre");
    const robloxInput = $("roblox");
    const error = $("errorIdentificacion");

    const nombre =
        nombreInput
            ? nombreInput.value.trim()
            : "";

    const roblox =
        robloxInput
            ? robloxInput.value.trim()
            : "";

    if (!nombre || !roblox) {

        if (error) {

            error.textContent =
                "Debe completar el nombre y el usuario de Roblox.";

            error.style.display = "block";
        }

        return;
    }

    if (error) {
        error.style.display = "none";
    }

    const banco = obtenerPreguntas();

    if (banco.length === 0) {

        alert(
            "ERROR S8\n\n" +
            "No hay preguntas cargadas.\n\n" +
            "Verifica que data/preguntas.js esté correctamente conectado."
        );

        return;
    }

    datosAspirante = {

        nombre: nombre,

        roblox: roblox,

        rango: "ASPIRANTE",

        especializacion: "GENERAL"
    };

    preguntaActual = 0;

    respuestas =
        new Array(banco.length).fill(null);


    /* Datos laterales */

    const sidebarNombre = $("sidebarNombre");
    const sidebarRoblox = $("sidebarRoblox");

    if (sidebarNombre) {
        sidebarNombre.textContent = nombre;
    }

    if (sidebarRoblox) {
        sidebarRoblox.textContent = roblox;
    }


    /* Crear navegación */

    crearNavegacion();


    /* Abrir examen */

    mostrarPantalla("evaluacion");

    mostrarPregunta();
}


/* =========================================================
   CREAR NAVEGACIÓN
========================================================= */

function crearNavegacion() {

    const grid = $("questionGrid");

    if (!grid) {

        console.error(
            "S8 | ERROR: No existe #questionGrid."
        );

        return;
    }

    const banco = obtenerPreguntas();


    /*
       IMPORTANTE:
       Limpia completamente el navegador
       para evitar preguntas duplicadas.
    */

    grid.innerHTML = "";


    banco.forEach(function (pregunta, indice) {

        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className =
            "question-number";

        boton.textContent =
            indice + 1;

        boton.title =
            `Ir a la pregunta ${indice + 1}`;

        boton.addEventListener(
            "click",
            function () {

                irAPregunta(indice);
            }
        );

        grid.appendChild(boton);
    });

    actualizarNavegacion();
}


/* =========================================================
   IR A PREGUNTA
========================================================= */

function irAPregunta(indice) {

    const banco = obtenerPreguntas();

    if (
        indice < 0 ||
        indice >= banco.length
    ) {

        return;
    }

    preguntaActual = indice;

    mostrarPregunta();
}


/* =========================================================
   MOSTRAR PREGUNTA
========================================================= */

function mostrarPregunta() {

    const banco = obtenerPreguntas();

    if (banco.length === 0) {
        return;
    }

    const pregunta =
        banco[preguntaActual];

    if (!pregunta) {
        return;
    }


    /* Número */

    const numero =
        $("numeroPregunta");

    if (numero) {

        numero.textContent =
            preguntaActual + 1;
    }


    /* Contador */

    const contador =
        $("contadorPregunta");

    if (contador) {

        contador.textContent =
            `PREGUNTA ${preguntaActual + 1} DE ${banco.length}`;
    }


    /* Año */

    const año =
        $("añoPregunta");

    if (año) {

        año.textContent =
            pregunta.año || "";
    }


    /* Formulario */

    const formulario =
        $("formularioPregunta");

    if (formulario) {

        formulario.textContent =
            pregunta.formulario || "";
    }


    /* Texto */

    const texto =
        $("textoPregunta");

    if (texto) {

        texto.textContent =
            pregunta.pregunta || "";
    }


    /* Opciones */

    mostrarOpciones(pregunta);


    /* Barra de progreso */

    const progreso =
        $("progressBar");

    if (progreso) {

        const porcentaje =
            ((preguntaActual + 1) / banco.length) * 100;

        progreso.style.width =
            `${porcentaje}%`;
    }


    /* Botón anterior */

    const anterior =
        $("btnAnterior");

    if (anterior) {

        anterior.disabled =
            preguntaActual === 0;
    }


    /* Botón siguiente */

    const siguiente =
        $("btnSiguiente");

    if (siguiente) {

        if (
            preguntaActual ===
            banco.length - 1
        ) {

            siguiente.textContent =
                "FINALIZAR EVALUACIÓN";

        } else {

            siguiente.textContent =
                "SIGUIENTE";
        }
    }


    actualizarResumen();

    actualizarNavegacion();


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


/* =========================================================
   MOSTRAR OPCIONES
========================================================= */

function mostrarOpciones(pregunta) {

    const contenedor =
        $("opciones");

    if (!contenedor) {

        console.error(
            "S8 | ERROR: No existe #opciones en index.html."
        );

        return;
    }


    /*
       IMPORTANTE:
       Borra las opciones anteriores.
       Esto evita que aparezcan DOBLES.
    */

    contenedor.innerHTML = "";


    const letras = [
        "A",
        "B",
        "C",
        "D"
    ];


    letras.forEach(function (letra) {

        if (
            !pregunta.opciones ||
            typeof pregunta.opciones[letra] === "undefined"
        ) {

            return;
        }


        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className =
            "answer-option";

        boton.dataset.letra =
            letra;


        /* Letra */

        const letraSpan =
            document.createElement("span");

        letraSpan.className =
            "answer-letter";

        letraSpan.textContent =
            letra;


        /* Texto */

        const textoSpan =
            document.createElement("span");

        textoSpan.className =
            "answer-text";

        textoSpan.textContent =
            pregunta.opciones[letra];


        boton.appendChild(letraSpan);

        boton.appendChild(textoSpan);


        /* Respuesta seleccionada */

        if (
            respuestas[preguntaActual] === letra
        ) {

            boton.classList.add(
                "selected"
            );
        }


        /* Evento */

        boton.addEventListener(
            "click",
            function () {

                seleccionarRespuesta(letra);
            }
        );


        contenedor.appendChild(boton);
    });
}


/* =========================================================
   SELECCIONAR RESPUESTA
========================================================= */

function seleccionarRespuesta(letra) {

    const banco =
        obtenerPreguntas();

    if (!banco[preguntaActual]) {
        return;
    }

    respuestas[preguntaActual] =
        letra;

    mostrarOpciones(
        banco[preguntaActual]
    );

    actualizarResumen();

    actualizarNavegacion();
}


/* =========================================================
   ACTUALIZAR RESUMEN
========================================================= */

function actualizarResumen() {

    const banco =
        obtenerPreguntas();

    const respondidas =
        respuestas.filter(
            function (respuesta) {

                return respuesta !== null;
            }
        ).length;

    const restantes =
        banco.length - respondidas;


    const elementoRespondidas =
        $("respondidas");

    const elementoRestantes =
        $("restantes");


    if (elementoRespondidas) {

        elementoRespondidas.textContent =
            respondidas;
    }

    if (elementoRestantes) {

        elementoRestantes.textContent =
            restantes;
    }
}


/* =========================================================
   ACTUALIZAR NAVEGACIÓN
========================================================= */

function actualizarNavegacion() {

    const botones =
        document.querySelectorAll(
            "#questionGrid .question-number"
        );


    botones.forEach(
        function (boton, indice) {

            boton.classList.remove(
                "current"
            );

            boton.classList.remove(
                "answered"
            );


            if (
                indice === preguntaActual
            ) {

                boton.classList.add(
                    "current"
                );
            }


            if (
                respuestas[indice] !== null &&
                typeof respuestas[indice] !== "undefined"
            ) {

                boton.classList.add(
                    "answered"
                );
            }
        }
    );
}


/* =========================================================
   SIGUIENTE
========================================================= */

function siguientePregunta() {

    const banco =
        obtenerPreguntas();


    if (
        respuestas[preguntaActual] === null ||
        typeof respuestas[preguntaActual] === "undefined"
    ) {

        alert(
            "Debe seleccionar una respuesta antes de continuar."
        );

        return;
    }


    if (
        preguntaActual <
        banco.length - 1
    ) {

        preguntaActual++;

        mostrarPregunta();

        return;
    }


    finalizarEvaluacion();
}


/* =========================================================
   ANTERIOR
========================================================= */

function preguntaAnterior() {

    if (preguntaActual <= 0) {
        return;
    }

    preguntaActual--;

    mostrarPregunta();
}


/* =========================================================
   FINALIZAR EVALUACIÓN
========================================================= */

function finalizarEvaluacion() {

    const pendientes =
        respuestas.filter(
            function (respuesta) {

                return (
                    respuesta === null ||
                    typeof respuesta === "undefined"
                );
            }
        ).length;


    if (pendientes > 0) {

        const confirmar =
            confirm(
                `Tiene ${pendientes} pregunta(s) sin responder.\n\n` +
                "¿Desea finalizar de todas formas?"
            );


        if (!confirmar) {
            return;
        }
    }


    const resultado =
        calcularResultado();


    guardarResultado(
        resultado
    );


    mostrarResultado(
        resultado
    );
}


/* =========================================================
   CALCULAR RESULTADO
========================================================= */

function calcularResultado() {

    const banco =
        obtenerPreguntas();

    let correctas = 0;


    banco.forEach(
        function (pregunta, indice) {

            if (
                respuestas[indice] &&
                respuestas[indice] ===
                pregunta.respuesta
            ) {

                correctas++;
            }
        }
    );


    const total =
        banco.length;


    const incorrectas =
        total - correctas;


    const porcentaje =
        total > 0
            ? Math.round(
                (correctas / total) * 100
            )
            : 0;


    const aprobado =
        porcentaje >=
        PUNTAJE_APROBACION;


    return {

        id:
            generarIdEvaluacion(),

        nombre:
            datosAspirante.nombre,

        roblox:
            datosAspirante.roblox,

        rango:
            "ASPIRANTE",

        especializacion:
            "GENERAL",

        total:
            total,

        correctas:
            correctas,

        incorrectas:
            incorrectas,

        porcentaje:
            porcentaje,

        estado:
            aprobado
                ? "APROBADO"
                : "NO APROBADO",

        fecha:
            obtenerFecha(),

        respuestas:
            [...respuestas]
    };
}


/* =========================================================
   GENERAR ID
========================================================= */

function generarIdEvaluacion() {

    const fecha =
        new Date();


    const año =
        fecha.getFullYear();


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");


    const aleatorio =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        `S8-${año}${mes}${dia}-${aleatorio}`
    );
}


/* =========================================================
   FECHA
========================================================= */

function obtenerFecha() {

    return new Date().toLocaleString(
        "es-CO",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );
}


/* =========================================================
   MOSTRAR RESULTADO
========================================================= */

function mostrarResultado(resultado) {


    /* Puntaje */

    const puntaje =
        $("puntajeFinal");

    if (puntaje) {

        puntaje.textContent =
            `${resultado.porcentaje}%`;
    }


    /* Estado */

    const estado =
        $("estadoResultado");

    if (estado) {

        estado.textContent =
            resultado.estado;


        estado.classList.remove(
            "approved",
            "failed",
            "rejected"
        );


        if (
            resultado.estado ===
            "APROBADO"
        ) {

            estado.classList.add(
                "approved"
            );

        } else {

            estado.classList.add(
                "failed"
            );
        }
    }


    /* Mensaje */

    const mensaje =
        $("mensajeResultado");

    if (mensaje) {

        if (
            resultado.estado ===
            "APROBADO"
        ) {

            mensaje.textContent =
                "El aspirante ha alcanzado el porcentaje mínimo establecido para la certificación académica.";

        } else {

            mensaje.textContent =
                "El aspirante no alcanzó el porcentaje mínimo establecido para la certificación académica.";
        }
    }


    /* Nombre */

    const nombre =
        $("resultadoNombre");

    if (nombre) {

        nombre.textContent =
            resultado.nombre;
    }


    /* Roblox */

    const roblox =
        $("resultadoRoblox");

    if (roblox) {

        roblox.textContent =
            resultado.roblox;
    }


    /* Preguntas */

    const preguntas =
        $("resultadoPreguntas");

    if (preguntas) {

        preguntas.textContent =
            resultado.total;
    }


    /* Fecha */

    const fecha =
        $("resultadoFecha");

    if (fecha) {

        fecha.textContent =
            resultado.fecha;
    }


    /* Correctas */

    const correctas =
        $("resultadoCorrectas");

    if (correctas) {

        correctas.textContent =
            resultado.correctas;
    }


    /* Incorrectas */

    const incorrectas =
        $("resultadoIncorrectas");

    if (incorrectas) {

        incorrectas.textContent =
            resultado.incorrectas;
    }


    /* ID */

    const evaluationId =
        $("evaluationId");

    if (evaluationId) {

        evaluationId.textContent =
            resultado.id;
    }


    /* Mostrar pantalla */

    mostrarPantalla(
        "resultado"
    );


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });


    console.log(
        "S8 | Evaluación finalizada:",
        resultado
    );
}


/* =========================================================
   GUARDAR RESULTADO
========================================================= */

function guardarResultado(resultado) {

    try {

        const datosGuardados =
            localStorage.getItem(
                STORAGE_KEY
            );


        let resultados = [];


        if (datosGuardados) {

            try {

                const parsed =
                    JSON.parse(
                        datosGuardados
                    );


                if (
                    Array.isArray(parsed)
                ) {

                    resultados =
                        parsed;
                }

            } catch (error) {

                console.warn(
                    "S8 | Registro local anterior inválido."
                );

                resultados = [];
            }
        }


        resultados.push(
            resultado
        );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                resultados
            )
        );


        console.log(
            "S8 | Resultado guardado correctamente."
        );


        return true;

    } catch (error) {

        console.error(
            "S8 | Error guardando resultado:",
            error
        );

        return false;
    }
}


/* =========================================================
   OBTENER RESULTADOS
========================================================= */

function obtenerResultados() {

    try {

        const datos =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!datos) {
            return [];
        }


        const resultados =
            JSON.parse(
                datos
            );


        return Array.isArray(
            resultados
        )
            ? resultados
            : [];


    } catch (error) {

        console.error(
            "S8 | Error leyendo resultados:",
            error
        );

        return [];
    }
}


/* =========================================================
   FUNCIONES DISPONIBLES PARA INDEX.HTML
========================================================= */

/*
   Como script.js se carga con:
   
   <script type="module" src="script.js"></script>

   las funciones NO quedan disponibles
   automáticamente para onclick="" del HTML.

   Por eso las colocamos manualmente en window.
*/

window.mostrarIdentificacion =
    mostrarIdentificacion;

window.volverInicio =
    volverInicio;

window.comenzarEvaluacion =
    comenzarEvaluacion;

window.seleccionarRespuesta =
    seleccionarRespuesta;

window.siguientePregunta =
    siguientePregunta;

window.preguntaAnterior =
    preguntaAnterior;

window.finalizarEvaluacion =
    finalizarEvaluacion;

window.obtenerResultados =
    obtenerResultados;


/* =========================================================
   CONFIRMACIÓN
========================================================= */

console.log(
    "S8 | script.js cargado correctamente."
);