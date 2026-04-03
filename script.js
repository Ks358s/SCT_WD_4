const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskTimeInput = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");
const taskTemplate = document.getElementById("taskTemplate");
const taskCount = document.getElementById("taskCount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const emptyState = document.getElementById("emptyState");

let tasks = [];

function formatDateTime(date, time) {
  const dateObj = new Date(`${date}T${time}`);
  return dateObj.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  taskCount.textContent = `${total} task${total === 1 ? "" : "s"}`;
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% complete`;
  emptyState.style.display = total === 0 ? "block" : "none";
}

function renderTask(task) {
  const fragment = taskTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".task-item");
  const title = fragment.querySelector(".task-title");
  const meta = fragment.querySelector(".task-meta");
  const checkbox = fragment.querySelector(".complete-toggle");
  const editButton = fragment.querySelector(".edit-btn");
  const deleteButton = fragment.querySelector(".delete-btn");

  item.dataset.id = task.id;
  title.textContent = task.title;
  meta.textContent = formatDateTime(task.date, task.time);
  checkbox.checked = task.completed;

  if (task.completed) {
    item.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    item.classList.toggle("completed", task.completed);
    updateSummary();
  });

  editButton.addEventListener("click", () => {
    const newTitle = window.prompt("Update task title", task.title);
    if (!newTitle) return;
    task.title = newTitle.trim();
    if (!task.title) return;
    title.textContent = task.title;
  });

  deleteButton.addEventListener("click", () => {
    item.classList.add("removing");
    window.setTimeout(() => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      item.remove();
      updateSummary();
    }, 190);
  });

  taskList.prepend(fragment);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const date = taskDateInput.value;
  const time = taskTimeInput.value;

  if (!title || !date || !time) {
    return;
  }

  const task = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    date,
    time,
    completed: false
  };

  tasks.push(task);
  renderTask(task);
  updateSummary();
  taskForm.reset();
  taskTitleInput.focus();
});

updateSummary();
