// Clock
function updateTime() {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// Dragging function
function dragElement(elmnt) {
  let pos1=0,pos2=0,pos3=0,pos4=0;
  const header = document.getElementById(elmnt.id + "header");
  (header || elmnt).onmousedown = dragMouseDown;

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

// Window controls
function closeWindow(element) { element.style.display = "none"; }
function openWindow(element) {
  element.style.display = "flex";
  bringToFront(element);
}

// Layer handling
let biggestIndex = 1;
function bringToFront(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}
function addWindowTapHandling(element) {
  element.addEventListener("mousedown", () => bringToFront(element));
}

// Auto‑wire all windows
document.querySelectorAll(".checklayer").forEach(win => {
  addWindowTapHandling(win);
  dragElement(win);
});

// Specific controls
const welcomeWindow = document.getElementById("welcome");
document.getElementById("welcomeclose").addEventListener("click", () => closeWindow(welcomeWindow));

const notesWindow = document.getElementById("notes");
document.getElementById("notesclose").addEventListener("click", () => closeWindow(notesWindow));
document.getElementById("notesIcon").addEventListener("dblclick", () => openWindow(notesWindow));
