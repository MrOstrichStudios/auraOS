// === Taskbar clock ===
function updateTaskbarTime() {
  const el = document.getElementById("taskbarTime");
  if (!el) return;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  el.innerHTML = time + "<br>" + date;
}

setInterval(updateTaskbarTime, 1000);
updateTaskbarTime();

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = document.getElementById(elmnt.id + "header");
  (header || elmnt).addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX; pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
    pos3 = e.clientX; pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null; document.onmousemove = null;
  }
}

function closeWindow(element) { element.style.display = "none"; }
function openWindow(element) {
  element.style.display = "flex";
  bringToFront(element);
}

let biggestIndex = 1;
function bringToFront(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () => bringToFront(element));
}

document.querySelectorAll(".checklayer").forEach(win => {
  addWindowTapHandling(win);
  dragElement(win);
});

const welcomeWindow = document.getElementById("welcome");
document.getElementById("welcomeclose").addEventListener("click", () => closeWindow(welcomeWindow));

// === Aura Meter App (declared first so terminal can reference it) ===
const auraWindow = document.getElementById("aura");
document.getElementById("auraclose").addEventListener("click", () => closeWindow(auraWindow));
document.getElementById("auraIcon").addEventListener("click", () => openWindow(auraWindow));

// === Terminal App ===
const terminalWindow = document.getElementById("terminal");
document.getElementById("terminalclose").addEventListener("click", () => closeWindow(terminalWindow));
document.getElementById("terminalIcon").addEventListener("click", () => openWindow(terminalWindow));

const terminalOutput = document.getElementById("terminalOutput");
const terminalInput = document.getElementById("terminalInput");

function printToTerminal(text) {
  terminalOutput.innerHTML += text + "\n";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function printToTerminalWithLinks(text) {
  const linked = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color:#00CCFF; text-decoration:underline; cursor:pointer;">$1</a>'
  );
  terminalOutput.innerHTML += linked + "\n";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function playAuraVideo() {
  const overlay = document.getElementById("auraVideoOverlay");
  const video = document.getElementById("auraVideo");
  if (!overlay || !video) return;
  overlay.style.display = "flex";
  video.currentTime = 0;
  video.muted = true; // start muted so autoplay is never blocked
  video.play().then(() => {
    video.muted = false; // unmute once playback has started -> sound plays
  }).catch(() => {
    video.muted = false; // if unmuting fails, still try to play with sound
  });
}

function runCommand(cmd) {
  const trimmed = cmd.trim();
  printToTerminal("guest@auraOS:~$ " + cmd);

  const args = trimmed.split(/\s+/);
  const command = args[0].toLowerCase();

  switch (command) {
    case "":
      break;
    case "whoami":
      printToTerminal("guest");
      break;
    case "aura":
      printToTerminal("SO DO YOU WANT AURA?");
      setTimeout(() => {
        printToTerminal("SO YOU WILL GET AURA!!!");
        setTimeout(playAuraVideo, 1000);
      }, 1000);
      break;
    case "about":
      printToTerminal("auraOS (tm)");
      printToTerminal("version 1.0");
      printToTerminal("");
      printToTerminal("developed by - me (MrOstrichStudios)");
      printToTerminal("");
      printToTerminal("made for - Stardance Hackclub 2026");
      printToTerminal("");
      printToTerminal("assets:");
      printToTerminalWithLinks("  notes icon - https://au.pinterest.com/pin/7177680647744158/");
      printToTerminalWithLinks("  aura video - https://www.youtube.com/watch?v=v_4KBXP3Mts");
      printToTerminal("");
      printToTerminal("coding assistance from ChatGPT, Copilot and Cline (vibecodin)");
      printToTerminal("");
      break;
    case "help":
      printToTerminal("Available commands:");
      printToTerminal("  whoami  - shows current user");
      printToTerminal("  aura    - you'll see");
      printToTerminal("  about   - shows info about auraOS");
      printToTerminal("  clear   - clears the terminal");
      printToTerminal("  help    - shows this message");
      break;
    case "clear":
      terminalOutput.innerHTML = "";
      break;
    default:
      printToTerminal("command not found: " + command + " (type 'help' for available commands)");
  }
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    runCommand(terminalInput.value);
    terminalInput.value = "";
  }
});

printToTerminal("auraOS Terminal v1.0");
printToTerminal("Type 'help' for available commands\n");

// === Notes App ===
const notesWindow = document.getElementById("notes");
document.getElementById("notesclose").addEventListener("click", () => closeWindow(notesWindow));
document.getElementById("notesIcon").addEventListener("click", () => openWindow(notesWindow));

let notes = [
  {
    id: Date.now(),
    title: "Welcome",
    date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
    content: `<p contenteditable="true">Welcome to <strong>Aura Notes</strong>!<br><br>If ya want to say something or have the fear of forgetting, just drop ya thoughts here!<br><br>Hi! I'm MrOstrich Studios and I'm just a chill guy who likes video games.</p>`
  },
  {
    id: Date.now() + 1,
    title: "Sample Note",
    date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
    content: `<p contenteditable="true">Just some basic non-chalant sample note -_-</p>`
  }
];

let activeNoteId = null;

function saveNotes() {
  // Notes are session-only — they reset on page reload.
}

function setNotesContent(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  activeNoteId = id;
  const notesContent = document.getElementById("notesContent");
  notesContent.innerHTML = `
    <div class="note-editor">
      <input class="note-title-input" value="${note.title}" placeholder="Note title...">
      <div class="note-date">${note.date}</div>
      <div class="note-body" contenteditable="true">${note.content}</div>
    </div>
  `;

  // Update active highlight in sidebar
  document.querySelectorAll("#sidebarList .note-item").forEach(el => {
    el.classList.toggle("active", Number(el.dataset.id) === id);
  });

  // Auto-save on edits
  const titleInput = notesContent.querySelector(".note-title-input");
  const bodyDiv = notesContent.querySelector(".note-body");

  titleInput.addEventListener("input", () => {
    note.title = titleInput.value;
    saveNotes();
    const item = document.querySelector(`#sidebarList .note-item[data-id="${id}"] .note-item-title`);
    if (item) item.textContent = titleInput.value || "Untitled";
  });

  bodyDiv.addEventListener("input", () => {
    note.content = bodyDiv.innerHTML;
    saveNotes();
  });
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebarList");
  sidebar.innerHTML = "";

  notes.forEach(note => {
    const item = document.createElement("div");
    item.className = "note-item";
    item.dataset.id = note.id;

    item.innerHTML = `
      <div class="note-item-top">
        <span class="note-item-title">${note.title}</span>
        <span class="note-item-del" title="Delete note">×</span>
      </div>
      <div class="note-item-date">${note.date}</div>
    `;

    item.querySelector(".note-item-title").addEventListener("click", () => setNotesContent(note.id));
    item.querySelector(".note-item-del").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });

    sidebar.appendChild(item);
  });
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  renderSidebar();
  if (activeNoteId === id) {
    activeNoteId = null;
    document.getElementById("notesContent").innerHTML = "";
  }
}

document.getElementById("addNoteBtn").addEventListener("click", () => {
  const newNote = {
    id: Date.now(),
    title: "New Note",
    date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
    content: `<p contenteditable="true">Start typing here...</p>`
  };
  notes.unshift(newNote);
  saveNotes();
  renderSidebar();
  setNotesContent(newNote.id);
});

renderSidebar();
if (notes.length > 0) {
  setNotesContent(notes[0].id);
}

// === Aura Meter App ===
let auraPoints = 0;

function getAuraRank() {
  if (auraPoints >= 100) return { text: "GIGACHAD 👑", color: "#FFD700" };
  if (auraPoints >= 75) return { text: "Aura Farmer 🌾", color: "#ADFF2F" };
  if (auraPoints >= 50) return { text: "Certified Chad 😎", color: "#00FF88" };
  if (auraPoints >= 25) return { text: "Gaining Aura 📈", color: "#00BFFF" };
  if (auraPoints > 0) return { text: "Tiny Aura ✨", color: "#FFA500" };
  if (auraPoints === 0) return { text: "NO AURA", color: "#FF4444" };
  return { text: "Aura Debt 💀", color: "#8B0000" };
}

function updateAura() {
  const clamped = Math.max(-100, Math.min(200, auraPoints));
  const pct = Math.max(0, Math.min(100, (clamped + 100) / 300 * 100));
  const ring = document.getElementById("auraRing");
  if (!ring) return;
  ring.style.background =
    `conic-gradient(#FFD700 0%, #FFA500 ${pct}%, rgba(255,255,255,0.1) ${pct}% 100%)`;
  document.getElementById("auraScore").innerText = clamped;
  const rank = getAuraRank();
  const rankEl = document.getElementById("auraRank");
  rankEl.innerText = rank.text;
  rankEl.style.color = rank.color;
}

document.getElementById("auraPlus").addEventListener("click", () => {
  auraPoints += 10;
  updateAura();
});

document.getElementById("auraMinus").addEventListener("click", () => {
  auraPoints -= 10;
  updateAura();
});

document.getElementById("auraReset").addEventListener("click", () => {
  auraPoints = 0;
  updateAura();
});

updateAura();

// === Calendar App ===
const calendarWindow = document.getElementById("calendar");
document.getElementById("calendarclose").addEventListener("click", () => closeWindow(calendarWindow));
document.getElementById("calendarIcon").addEventListener("click", () => openWindow(calendarWindow));

let calYear, calMonth;

const DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BIRTHDAY_MONTH = 10; // November (0-indexed)
const BIRTHDAY_DAY = 15;
const BIRTHDAY_LABEL = "🎂 MrOstrich Studios' Birthday";

function renderCalendar() {
  const today = new Date();
  const grid = document.getElementById("calGrid");
  const dow = document.getElementById("calDow");
  grid.innerHTML = "";
  dow.innerHTML = "";

  DOWS.forEach(d => {
    const el = document.createElement("div");
    el.innerText = d;
    dow.appendChild(el);
  });

  document.getElementById("calMonthYear").innerText = MONTHS[calMonth] + " " + calYear;

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Birthday info banner when viewing November
  let birthdayBanner = document.getElementById("birthdayBanner");
  if (!birthdayBanner) {
    birthdayBanner = document.createElement("div");
    birthdayBanner.id = "birthdayBanner";
    grid.parentNode.insertBefore(birthdayBanner, grid);
  }
  if (calMonth === BIRTHDAY_MONTH) {
    birthdayBanner.style.display = "block";
    birthdayBanner.textContent = BIRTHDAY_LABEL + " — " + BIRTHDAY_DAY + " " + MONTHS[BIRTHDAY_MONTH];
  } else {
    birthdayBanner.style.display = "none";
  }

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    blank.innerText = "";
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.innerText = d;
    cell.style.padding = "6px";
    cell.style.borderRadius = "8px";

    if (calMonth === BIRTHDAY_MONTH && d === BIRTHDAY_DAY) {
      // Birthday highlight
      cell.style.background = "linear-gradient(135deg, #FF69B4, #FFD700)";
      cell.style.color = "#1a1a2e";
      cell.style.fontWeight = "bold";
      cell.style.boxShadow = "0 0 10px rgba(255, 105, 180, 0.5)";
      cell.style.cursor = "default";
    } else if (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()) {
      cell.style.background = "#FFD700";
      cell.style.color = "#1a1a2e";
      cell.style.fontWeight = "bold";
    } else {
      cell.style.background = "rgba(255,255,255,0.1)";
    }

    grid.appendChild(cell);
  }
}

document.getElementById("calPrev").addEventListener("click", () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById("calNext").addEventListener("click", () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

const now = new Date();
calYear = now.getFullYear();
calMonth = now.getMonth();
renderCalendar();

// === Files App ===
const filesWindow = document.getElementById("files");
document.getElementById("filesclose").addEventListener("click", () => closeWindow(filesWindow));
document.getElementById("filesIcon").addEventListener("click", () => openWindow(filesWindow));

const virtualFiles = [
  {
    name: "abt-me.txt",
    content: "Hi im MrOstrichStudios and im human\n"
  }
];

function renderFileList() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  virtualFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.innerText = "📄 " + file.name;
    item.style.cursor = "pointer";
    item.style.padding = "6px 8px";
    item.style.marginBottom = "4px";
    item.style.borderRadius = "8px";
    item.style.background = "rgba(255,255,255,0.1)";
    item.addEventListener("click", () => {
      document.getElementById("fileContent").innerText = file.content;
    });
    list.appendChild(item);
  });
}

renderFileList();

// Load abt-me.txt content initially
document.getElementById("fileContent").innerText = virtualFiles[0].content;

// === Aura Video ===
document.getElementById("auraVideoClose").addEventListener("click", () => {
  const overlay = document.getElementById("auraVideoOverlay");
  const video = document.getElementById("auraVideo");
  overlay.style.display = "none";
  video.pause();
});

// === Taskbar ===
document.getElementById("taskbarNotes").addEventListener("click", () => openWindow(notesWindow));
document.getElementById("taskbarAura").addEventListener("click", () => openWindow(auraWindow));
document.getElementById("taskbarCalendar").addEventListener("click", () => openWindow(calendarWindow));
document.getElementById("taskbarFiles").addEventListener("click", () => openWindow(filesWindow));
document.getElementById("taskbarTerminal").addEventListener("click", () => openWindow(terminalWindow));
document.getElementById("taskbarRestart").addEventListener("click", () => location.reload());
