function updateTime() {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

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

const notesWindow = document.getElementById("notes");
document.getElementById("notesclose").addEventListener("click", () => closeWindow(notesWindow));
document.getElementById("notesIcon").addEventListener("dblclick", () => openWindow(notesWindow));

var content = [
  {
    title: `<span style="color:#fff;">Welcome</span>`,
    date: "06/28/2023",
    content: `
      <div style="color:#fff; font-size:14px; line-height:1.5;">
        <p contenteditable="true">
          <span contenteditable="true">
            Welcome to <strong>Aura Notes</strong>
            <br><br>
            If ya want to say something or have the fear of forgetting, just drop ya thoughts here!
          </span>
        </p>
        <p contenteditable="true">
          Hi! I'm MrOstrich Studios and I'm just a chill guy who likes video games.
        </p>
      </div>
    `
  },
  {
    title: `<span style="color:#fff;">Sample Note</span>`,
    date: "09/04/2026",
    content: `
      <div style="color:#fff; font-size:14px; line-height:1.5;">
        <p contenteditable="true">
          Just some basic non‑chalant sample note -_-
        </p>
      </div>
    `
  }
];

function setNotesContent(index) {
  var notesContent = document.querySelector("#notesContent");
  notesContent.innerHTML = content[index].content;
}

function addToSideBar(index) {
  var sidebar = document.querySelector("#sidebar");
  var note = content[index];

  var newDiv = document.createElement("div");
  newDiv.style.cursor = "pointer";
  newDiv.style.marginBottom = "8px";

  newDiv.innerHTML = `
    <p style="margin:0; font-weight:bold;">${note.title}</p>
    <p style="font-size:12px; margin:0;">${note.date}</p>
  `;

  newDiv.addEventListener("click", function() {
    setNotesContent(index);
  });

  sidebar.appendChild(newDiv);
}

for (let i = 0; i < content.length; i++) {
  addToSideBar(i);
}

setNotesContent(0);