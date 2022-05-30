class Library {
  constructor() {
    this.arr = [];
  }

  addBook(title, author, progress, total) {
    let newBook = new Book(title, author, progress, total);
    this.arr.push(newBook);
    localStorage.setItem("library", JSON.stringify(this.arr));
    return newBook;
  }

  removeBook(index) {
    this.arr.splice(index, 1);
    localStorage.setItem("library", JSON.stringify(this.arr));
  }

  getBook(index) {
    return this.arr[index];
  }
}

class Book {
  constructor(title, author, progress, total) {
    this.title = title;
    this.author = author;
    this.progress = progress;
    this.total = total;
  }
}

const createBookBtn = document.querySelector("#create-book-btn");
const modalEl = document.querySelector(".modal");
const closeModalBtn = document.querySelector("#close-modal-btn");
const formEl = document.querySelector(".add-book-form");
const addBookBtn = document.querySelector("#add-book-btn");
const tableEl = document.querySelector("table");

let library = new Library();
console.log(localStorage.getItem("library"));
if (window.localStorage.getItem("library") != null) {
  library.arr = JSON.parse(localStorage.getItem("library"));
  library.arr.forEach((book) => {
    addBookToTable(book);
  });
}

createBookBtn.addEventListener("click", (e) => {
  modalEl.style.display = "block";
});

closeModalBtn.addEventListener("click", (e) => {
  modalEl.style.display = "none";
  clearInputFields();
});

window.onclick = function (e) {
  if (e.target === modalEl) {
    modalEl.style.display = "none";
    clearInputFields();
  }
};

formEl.addEventListener("submit", (e) => {
  e.preventDefault(); // stop page from reloading (default behavior)

  // check if required fields are filled
  let allFilled = true;
  formEl.querySelectorAll("[required]").forEach((i) => {
    if (!i.value) {
      // TODO: change color of field to red;
      allFilled = false;
      return;
    }
  });

  if (!allFilled) {
    return;
  }

  let inputs = formEl.elements;
  let newBook = library.addBook(
    inputs["title"].value,
    inputs["author"].value,
    inputs["progress"].value,
    inputs["total"].value
  );

  addBookToTable(newBook);
  clearInputFields();
  console.log(localStorage.getItem("library"));
});

function addBookToTable(book) {
  let row = tableEl.insertRow(-1);
  row.classList.add("entry");
  row.innerHTML += `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="num">${book.progress}</td>
    <td class="num">${book.total}</td>
    <td class="btn-cell">
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="remove-btn"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  addEntryEventListeners();
}

function clearInputFields() {
  formEl.querySelectorAll("input").forEach((i) => {
    i.value = "";
  });
}

function addEntryEventListeners() {
  editBtns = document.querySelectorAll(".edit-btn");
  removeBtns = document.querySelectorAll(".remove-btn");

  editBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      let book = library.getBook(index);
      modalEl.style.display = "block";
      formEl.title.value = book.title;
      formEl.author.value = book.author;
      formEl.progress.value = book.progress;
      formEl.total.value = book.total;
    });
  });

  removeBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      library.removeBook(index);
      // FIXME: this keeps propagating and deleting every book from the array

      let rowEl = e.target.parentElement.parentElement.parentElement;
      removeBookFromTable(rowEl);
      console.log(localStorage.getItem("library"));
    });
  });
}

function removeBookFromTable(rowEl) {
  rowEl.remove();
}
