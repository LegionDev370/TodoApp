const form = document.querySelector("form");

let inputTodo = findElement("#form1");

let templateTodos = findElement("#template-todos").content;

let templateChecked = findElement("#template-checked").content;

let tbodyChecking = findElement("#tbody-checking");

let tbodyChecked = findElement("#tbody-checked");

let arrayTodo = [];
let editArray = [];
let finishedArray = [];
let filtredFinishedArray = [];

if (localStorage.getItem("tasks")) {
  arrayTodo = JSON.parse(localStorage.getItem("tasks"));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  AddTaskTodo(arrayTodo);
  AddTaskToPage(arrayTodo);
  window.localStorage.setItem("tasks", JSON.stringify(arrayTodo));
});
let num = 0;

function AddTaskTodo(array) {
  if (inputTodo.value !== "") {
    let obj = {
      id: ++num,
      title: inputTodo.value,
      completed: false,
    };
    array.push(obj);
    inputTodo.value = "";
  }
}

function AddTaskToPage(array) {
  tbodyChecking.innerHTML = "";
  let filtrArrayId = [];
  array.forEach((element, index) => {
    let todosTemplateActive = templateTodos.cloneNode(true);
    let todosNumber = findElement(".todos-number", todosTemplateActive);
    let todosItemText = findElement("#todos-item-text", todosTemplateActive);
    let editText = findElement("#edit-text", todosTemplateActive);
    let deleteBtn = findElement("#todos-delete-btn", todosTemplateActive);
    let finishedBtn = findElement("#todos-finished-btn", todosTemplateActive);
    let todosProgress = findElement(".todos-progress", todosTemplateActive);
    let todoEditBtn = findElement("#todos-edit-btn", todosTemplateActive);
    let editForm = findElement(".edit-form", todosTemplateActive);
    todoEditBtn.dataset.todoid = element.id;
    finishedBtn.dataset.todoid = element.id;
    deleteBtn.dataset.todoid = element.id;
    editText.className = "todos-edit-input";
    editText.dataset.todoid = element.id;
    todosItemText.innerHTML = element.title;
    todosNumber.innerHTML = ++index;

    if (index === element.id) {
      element.id = index;
      filtrArrayId = array;
    }
    if (element.completed) {
      todosProgress.textContent = "Completed";
      finishedBtn.textContent = "Unfinished";
    } else {
      todosProgress.textContent = "In progress";
      finishedBtn.textContent = "Finished";
    }

    AddTaskTodo(filtrArrayId);

    deleteBtn.addEventListener("click", () => {
      let arrayFilter = array.filter((filter) => {
        return Number(deleteBtn.dataset.todoid) !== filter.id;
      });
      arrayTodo = arrayFilter;
      let getArrayLocal = localStorage.getItem("tasks");
      let parseArray = JSON.parse(getArrayLocal);
      parseArray = arrayTodo;
      window.localStorage.setItem("tasks", JSON.stringify(parseArray));
      let getModifyArray = localStorage.getItem("tasks");
      let parseModifyArray = JSON.parse(getModifyArray);
      AddTaskTodo(parseModifyArray);
      AddTaskToPage(parseModifyArray);
    });

    finishedBtn.addEventListener("click", () => {
      if (!element.completed) {
        element.completed = true;
        if (element.completed) {
          filtredFinishedArray.push(element);
        }
        finishedArray = array;
        arrayTodo = finishedArray;
        window.localStorage.setItem("tasks", JSON.stringify(arrayTodo));
        AddTaskTodo(arrayTodo);
        AddTaskToPage(arrayTodo);
      } else {
        let unfinishedArray = [];
        element.completed = false;
        if (!element.completed) {
          filtredFinishedArray.pop(element);
        }
        unfinishedArray = array;
        arrayTodo = unfinishedArray;
        window.localStorage.setItem("tasks", JSON.stringify(arrayTodo));
        AddTaskTodo(arrayTodo);
        AddTaskToPage(arrayTodo);
      }
    });
    todoEditBtn.addEventListener("click", () => {
      editText.className = "todos-edit-input-active";
      todosItemText.style.display = "none";
    });
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (Number(editText.dataset.todoid) === element.id) {
        element.title = editText.value;
        editArray = array;
        arrayTodo = editArray;
        AddTaskToPage(arrayTodo);
        window.localStorage.setItem("tasks", JSON.stringify(arrayTodo));
      }
    });
    tbodyChecking.appendChild(todosTemplateActive);
  });
  window.localStorage.setItem(
    "finishedTasks",
    JSON.stringify(filtredFinishedArray)
  );
  AddFinishedArray(filtredFinishedArray);
}
if (localStorage.getItem("finishedTasks")) {
  filtredFinishedArray = JSON.parse(localStorage.getItem("finishedTasks"));
}
function AddFinishedArray(array) {
  tbodyChecked.innerHTML = "";
  array.forEach((element, index) => {
    let templateCheckedClone = templateChecked.cloneNode(true);
    let todosNumber = findElement(".todos-number", templateCheckedClone);
    let todosDeleteBtn = findElement("#todos-delete-btn", templateCheckedClone);
    todosDeleteBtn.dataset.todoid = element.id;
    let todosItemText = findElement("#todos-item-text", templateCheckedClone);
    let editText = findElement("#edit-text", templateCheckedClone);
    let todosProgress = findElement(".todos-progress", templateCheckedClone);
    todosDeleteBtn.addEventListener("click", () => {
      let filtrArray = array.filter((todo) => {
        return Number(todosDeleteBtn.dataset.todoid) !== todo.id;
      });
      filtredFinishedArray = filtrArray;
      window.localStorage.setItem("finishedTasks",JSON.stringify(filtredFinishedArray));
      let getItem = JSON.parse(localStorage.getItem("finishedTasks"));
      AddFinishedArray(getItem);
    });
    editText.className = "todos-edit-input";
    todosItemText.innerHTML = element.title;
    todosNumber.innerHTML = ++index;
    todosProgress.textContent = "Completed";
    todosProgress.style.color = "blue";
    tbodyChecked.appendChild(templateCheckedClone);
  });
}
function getFinishedArrayLocal() {
  let finished = localStorage.getItem("finishedTasks");
  let parsedata = JSON.parse(finished);
  AddFinishedArray(parsedata);
}

function getItemLocalStorage() {
  let data = localStorage.getItem("tasks");
  let parseData = JSON.parse(data);
  AddTaskToPage(parseData);
}
getItemLocalStorage();

getFinishedArrayLocal();
