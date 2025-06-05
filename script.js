document.addEventListener("DOMContentLoaded", () => {
  console.log(">> Cargando terminal virtual...");
});

const output = document.getElementById('output');
const inputLine = document.querySelector('.input-line');
const commandInput = document.getElementById('commandInput');
const promptElement = document.querySelector('.prompt');

let hackerMode = false;

const introLines = [
  "Iniciando sistema...",
  "Conectando a red segura...",
  "Acceso a base de datos: OK",
  "Escaneando puertos...",
  "Acceso concedido.",
  "Bienvenido."
];

const portfolioProjects = [
  { title: "rvs: Reverse Shell Web Generator", url: "posts/proyecto1.html" },
  { title: "mctg: Mini CTF Game", url: "posts/proyecto2.html" }
];

// Variable para el "directorio actual"
let currentDir = "";

// Función para actualizar prompt según el directorio actual
function updatePrompt() {
  if (currentDir) {
    promptElement.textContent = currentDir + ">";
  } else {
    promptElement.textContent = ">";
  }
}

// Objeto para simular directorios y sus URLs
const directories = {
  rvs: "posts/proyecto1.html",
  mctg: "posts/proyecto2.html"
};

// Comandos disponibles
const commands = {
  help: {
    description: "Lista de comandos disponibles",
    action: () => {
    printOutput("Comandos:");
    // Recorrer todas las claves de commands
    Object.keys(commands).forEach(cmd => {
      // Mostrar el nombre y la descripción
      printOutput(`${cmd} - ${commands[cmd].description}`);
    });
    }
  },
  ls: {
  description: "Lista los proyectos disponibles",
  action: () => {
    printOutput("Proyectos:");
    portfolioProjects.forEach(p => {
      printOutput(`- ${p.title}`);
    });
  }
    },
  about: {
    description: "Información sobre el autor",
    action: () => {
      printOutput("Abriendo portfolio personal en una nueva pestaña...");
      window.open("https://yeeiisi.github.io/yeeiisi/", "_blank");
    }
  },
  clear: {
    description: "Limpia la pantalla",
    action: () => {
      output.textContent = "";
    }
  },
  hacker: {
  description: "Activa o desactiva el modo hacker visual",
  action: () => {
    hackerMode = !hackerMode;

    if (hackerMode) {
      document.body.style.backgroundColor = "#001100"; // fondo oscuro verde muy oscuro
      printOutput("Modo hacker ACTIVADO. Disfruta el caos visual. (aún no está perfeccionado)", "output");
      // Podrías agregar aquí clases CSS para efectos más avanzados
      output.classList.add("hacker-effect");
    } else {
      document.body.style.backgroundColor = "#000"; // fondo negro normal
      printOutput("Modo hacker DESACTIVADO. Volviendo a la normalidad.", "output");
      output.classList.remove("hacker-effect");
    }
  }
},
  /*addcmd: {
  description: "Agregar comando personalizado: addcmd nombre comandoRespuesta",
  action: (args) => {
    if (args.length < 2) {
      printOutput("Uso: addcmd nombre comandoRespuesta", "error");
      return;
    }
    const name = args[0].toLowerCase();
    const response = args.slice(1).join(" ");

    if (commands[name]) {
      printOutput(`El comando '${name}' ya existe. Elige otro nombre.`, "error");
      return;
    }

    // Guardar en localStorage y agregar al objeto commands
    saveCustomCommand(name, response);
    commands[name] = {
      description: "(comando personalizado)",
      action: () => printOutput(response)
    };

    printOutput(`Comando '${name}' agregado exitosamente.`);
    }
    },*/
    echo : {
    description: "Muestra texto con estilo",
    action: (args) => {
    if (args.length === 0) {
      printOutput("Error: Debes escribir un texto para mostrar.", "error");
      return;
    }
    const text = args.join(" ");
    const styledLine = document.createElement("div");
    styledLine.style.color = "#0ff"; // cyan
    styledLine.style.fontWeight = "bold";
    styledLine.textContent = text;
    output.appendChild(styledLine);
    output.scrollTop = output.scrollHeight;
    }
    },

  cve: {
    description: "Consulta vulnerabilidades",
    action: () => {
      printOutput("Próximamente: Consulta bases de datos de CVEs.");
    }
  },
  cd: {
    description: "Cambiar directorio",
    action: (args) => {
      if (args.length === 0) {
        printOutput("Error: Debes indicar un directorio. Ejemplo: cd proyecto1", "error");
        return;
      }
      const target = args[0].toLowerCase();
      if (target === "..") {
        if (currentDir) {
          currentDir = "";
          updatePrompt();
          printOutput("Volviendo al directorio raíz.");
        } else {
          printOutput("Ya estás en el directorio raíz.");
        }
        return;
      }
      if (directories[target]) {
        currentDir = target;
        updatePrompt();
        printOutput(`Entrando a ${target}...`);
        printOutput("Para abrir el proyecto, escribe 'open'.");
      } else {
        printOutput(`Directorio '${target}' no encontrado.`, "error");
      }
    }
  },
  open: {
    description: "Abre el proyecto del directorio actual",
    action: () => {
      if (currentDir && directories[currentDir]) {
        printOutput(`Abriendo ${currentDir} en una nueva pestaña...`);
        window.open(directories[currentDir], "_blank");
      } else {
        printOutput("No estás en un directorio válido para abrir proyecto.", "error");
      }
    }
  }
};

loadCustomCommands();

// Función para imprimir en el output y hacer scroll automático
function printOutput(text = "", type = "output") {
  const line = document.createElement("div");

  if (type === "command") {
    line.className = "line-command";
  } else if (type === "error") {
    line.className = "line-error";
  } else {
    line.className = "line-output";
  }

  if(hackerMode && type === "output") {
    const neonColors = ["#0f0", "#0ff", "#8f8", "#0a0"];
    line.style.color = neonColors[Math.floor(Math.random() * neonColors.length)];
    line.style.textShadow = `0 0 10px ${line.style.color}`;
  }

  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// Simulación de tipeo para la intro
function typeLine(line, delay = 40) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      output.textContent += line.charAt(i);
      i++;
      if (i === line.length) {
        clearInterval(interval);
        output.textContent += "\n";
        resolve();
      }
    }, delay);
  });
}

// Mostrar intro animada y luego activar consola
async function playIntro() {
  for (const line of introLines) {
    await typeLine(line);
    await new Promise(r => setTimeout(r, 400));
  }
  inputLine.style.display = "flex";
  commandInput.focus();
  updatePrompt();
}

// Manejar comando ingresado
function handleCommand(input) {
  if (!input) return;

  printOutput("> " + input, "command");

  let [cmd, ...args] = input.trim().toLowerCase().split(" ");

  // Si se usa sudo
  if (cmd === "sudo") {
    if (args.length === 0) {
      printOutput("sudo: se requiere un comando para ejecutar.", "error");
      return;
    }

    const realCmd = args[0];
    const realArgs = args.slice(1);

    printOutput("Autenticando como superusuario...", "output");

    setTimeout(() => {
      if (commands[realCmd]) {
        // Ejecutar comando con "privilegios"
        commands[realCmd].action(realArgs);
        printOutput("Comando ejecutado con privilegios de superusuario.", "output");
      } else if (realCmd === "secret") {
        printOutput("Accediendo a sistema oculto...");
        setTimeout(() => {
          printOutput("¡Has desbloqueado el acceso al sistema secreto!");
          printOutput("Flag: CTF{terminal_hackeada_con_sudo}");
        }, 1000);
      } else {
        printOutput(`sudo: comando '${realCmd}' no encontrado. Acceso denegado.`, "error");
      }
    }, 1200);

    return;
  }

  // Si no es sudo, procesa normalmente
  if (commands[cmd]) {
    commands[cmd].action(args);
  } else {
    printOutput(`Comando '${cmd}' no encontrado. Escribe 'help' para ver comandos.`, "error");
  }
}

// Evento al presionar Enter
commandInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const input = commandInput.value;
    handleCommand(input);
    commandInput.value = "";
  }
});

// Guardar un nuevo comando personalizado en localStorage
function saveCustomCommand(name, response) {
  // Obtener comandos guardados o iniciar objeto vacío
  const customCommands = JSON.parse(localStorage.getItem('customCommands') || '{}');
  // Añadir o actualizar comando
  customCommands[name] = response;
  // Guardar nuevamente
  localStorage.setItem('customCommands', JSON.stringify(customCommands));
}

// Cargar comandos personalizados desde localStorage y agregarlos a commands
function loadCustomCommands() {
  const customCommands = JSON.parse(localStorage.getItem('customCommands') || '{}');
  for (const [name, response] of Object.entries(customCommands)) {
    // No sobreescribas comandos base
    if (!commands[name]) {
      commands[name] = {
        description: "(comando personalizado)",
        action: () => printOutput(response)
      };
    }
  }
}


window.onload = () => {
  inputLine.style.display = "none"; // ocultar input hasta que termine la intro
  playIntro();
};
