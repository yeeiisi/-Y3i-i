const output = document.getElementById("output");
const commandInput = document.getElementById("commandInput");
const promptElement = document.querySelector(".prompt");
const inputLine = document.getElementById("inputLine"); 

let currentDir = "";
let hackerMode = false;

function updatePrompt() {
  promptElement.textContent = (currentDir || "~") + ">";
}
updatePrompt();

function printOutput(text = "", type = "output") {
  const line = document.createElement("div");

  if (type === "command") {
    line.className = "line-command";
  } else if (type === "error") {
    line.className = "line-error";
  } else if (type === "intro") {
    line.className = "line-intro";
  } else {
    line.className = "line-output";
  }

  if (hackerMode && type === "output") {
    const neonColors = ["#0f0", "#0ff", "#8f8", "#0a0"];
    line.style.color = neonColors[Math.floor(Math.random() * neonColors.length)];
    line.style.textShadow = `0 0 10px ${line.style.color}`;
  }

  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}


const directories = {
  //blog: "posts/blog.html",
  portfolio: "https://yeeiisi.github.io/yeeiisi/",
  tools: "https://github.com/yeeiisi/Herramientas-hacking-etico",
  //social: "posts/social.html"
};

const introLines = [
  "Iniciando sistema...",
  "Conectando a red segura...",
  "Acceso a base de datos: OK",
  "Escaneando puertos...",
  "Acceso concedido.",
  "Bienvenido."
];

function typeLine(line, delay = 25) {
  return new Promise(resolve => {
    let i = 0;
    const lineElem = document.createElement("div");
    lineElem.className = "line-intro";
    output.appendChild(lineElem);

    const interval = setInterval(() => {
      lineElem.textContent += line.charAt(i);
      i++;
      output.scrollTop = output.scrollHeight;
      if (i === line.length) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}

async function playIntro() {
  inputLine.style.display = "none";
  for (const line of introLines) {
    await typeLine(line);
    await new Promise(r => setTimeout(r, 500));
  }
  inputLine.style.display = "flex";
  commandInput.focus();
  updatePrompt();
}

const commands = {
  help: {
    description: "Muestra esta lista de comandos",
    action: () => {
      printOutput("Comandos disponibles:");
      Object.keys(commands).forEach(cmd => {
        printOutput(`- ${cmd}: ${commands[cmd].description || "Sin descripción"}`);
      });
    }
  },
  ls: {
    description: "Lista los directorios disponibles",
    action: () => {
      printOutput("Directorios disponibles:");
      Object.keys(directories).forEach(dir => {
        printOutput(`- ${dir}`);
      });
    }
  },
  cd: {
    description: "Cambia de directorio",
    action: (args) => {
      if (!args.length) return printOutput("Especifica un directorio", "error");
      const dir = args[0];
      if (directories[dir]) {
        currentDir = dir;
        updatePrompt();
        printOutput(`Entrando a ${dir}...`);
        printOutput("Usa 'open' para abrir la sección real");
      } else if (dir === "..") {
        currentDir = "";
        updatePrompt();
        printOutput("Volviendo al directorio raíz");
      } else {
        printOutput("Directorio no encontrado", "error");
      }
    }
  },
  open: {
    description: "Abre la sección actual",
    action: () => {
      if (directories[currentDir]) {
        window.open(directories[currentDir], "_blank");
        printOutput(`Abriendo ${currentDir}...`);
      } else {
        printOutput("No estás en un directorio válido", "error");
      }
    }
  },
  status: {
    description: "Muestra estado del sistema",
    action: () => {
      const uptime = Math.floor(performance.now() / 1000);
      printOutput("Estado del sistema:");
      printOutput(`Uptime: ${uptime}s`);
      printOutput("CPU: 2 núcleos virtuales");
      printOutput("RAM: 4 GB simulada");
      printOutput("Red: segura (VPN activa)");
    }
  },
  whoami: {
    description: "Muestra información de usuario",
    action: () => {
      printOutput("Nombre: Yeiisi");
      printOutput("Alias: Y3i$i");
      printOutput("Estudiante de Ing. Informática aficionado a la Ciberseguridad");
    }
  },
sudo: {
  description: "Simula acceso root",
  action: () => {
    printOutput("Acceso denegado: este intento será reportado.", "error");

    // Imprimir alerta 5 veces con retardo
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        printOutput("[ALERTA] Intento de escalado de privilegios detectado", "error");
      }, i * 500);
    }

    // Después de la última alerta, comenzar secuencia de autodestrucción
    const selfDestructLines = [
      "ERROR CRÍTICO: INTRUSIÓN DETECTADA",
      "INICIANDO PROTOCOLO DE AUTODESTRUCCIÓN...",
      "3...",
      "2...",
      "1...",
      "SISTEMA BLOQUEADO. CONTACTE AL ADMINISTRADOR."
    ];

    // Iniciar la secuencia con delay después de la última alerta
    setTimeout(() => {
      selfDestructLines.forEach((line, index) => {
        setTimeout(() => {
          printOutput(line, "error");

          // Al final, limpiar terminal y comenzar animación
          if (index === selfDestructLines.length - 1) {
            setTimeout(() => {
              // Bloquear input y cambiar placeholder
              commandInput.disabled = true;
              commandInput.value = "";
              commandInput.placeholder = "Sistema bloqueado";

              // Limpiar la terminal
              output.innerHTML = "";

              // Animación de caracteres ilegibles
              let count = 0;
              const maxCount = 100;
              const chars = "ﾊﾐﾋｰｳｼﾅﾓｻﾜﾂﾈｷﾑﾕﾗｿﾎﾓﾔﾎﾍﾄｱｲｴｵｶｷｸﾗｽ";

              const animInterval = setInterval(() => {
                const line = Array.from({ length: 123 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
                printOutput(line, "error");
                count++;
                if (count >= maxCount) {
                  clearInterval(animInterval);
                }
              }, 150);
            }, 1000);
          }
        }, index * 400 * (index + 1)); // delay progresivo
      });
    }, 5 * 500 + 500);
  }
},

  hacker: {
    description: "Activa efecto Matrix hacker",
    action: () => {
      hackerMode = true;
      let interval = setInterval(() => {
        const line = Array.from({ length: 123 }, () =>
          String.fromCharCode(0x30A0 + Math.random() * 96)
        ).join('');
        printOutput(line);
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        hackerMode = false;
      }, 8000);
    }
  },
  glitch: {
    description: "Simula fallo gráfico",
    action: () => {
      const glitchText = [
        "ERROR 0x000F4: ~!#@!# SYSTEM FAILURE",
        "████████████████████████████",
        ":: DESINTEGRANDO REALIDAD ::",
        "matrix_overflow>_"
      ];
      glitchText.forEach((line, i) => {
        setTimeout(() => printOutput(line, "error"), i * 300);
      });
    }
  }
};

function handleCommand(input) {
  if (!input) return;
  printOutput("> " + input, "command");
  const [cmd, ...args] = input.trim().split(" ");
  const command = commands[cmd];
  if (command) {
    command.action(args);
  } else {
    printOutput(`Comando '${cmd}' no encontrado`, "error");
  }
}

commandInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const input = commandInput.value.trim();
    handleCommand(input);
    commandInput.value = "";
  }
});

window.onload = () => {
  playIntro();
};
