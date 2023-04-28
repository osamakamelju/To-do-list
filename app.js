// få alla uppgifter från localStorage
window.onload = loadTasks;

// På form skicka, lägga till uppgift
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // kolla om localStorage har några uppgifter.. om inte, återvänd sedan
  if (localStorage.getItem("tasks") == null) return;

  // Få uppgifterna från localStorage och konvertera det till en array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // Gå igenom uppgifterna och lägg till dem i listan
  tasks.forEach(task => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
      <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // returnera om uppgiften är tom
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // kolla upp om uppgiften redan finns
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  // lägga till uppgift till lokal Storage
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

  // skapa listobjekt, lägg till innerHTML och lägg till i ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
  <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
  <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);

  
  task.value = "";
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // Ta borta uppgifterna
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// lagra aktuell uppgift för att spåra ändringar
var currentTask = null;

// få aktuell uppgift
function getCurrentTask(event) {
  currentTask = event.value;
}

// redigera uppgiften och uppdatera lokal lagring
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // kolla up om uppgiften är tom
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // Om uppgiften finns redan
  tasks.forEach(task => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currentTask;
      return;
    }
  });
  // updatera uppgiften
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // updatera lokal Storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}