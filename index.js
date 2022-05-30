/**
  Manages the library array and local storage.
*/
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

  getIndex(query) {
    this.arr.forEach((book, index) => {
      if (book === query) {
        return index;
      }
    });
    return -1;
  }

  overwriteBook(index, title, author, progress, total) {
    let newBook = new Book(title, author, progress, total);
    this.arr[index] = newBook;
    localStorage.setItem("library", JSON.stringify(this.arr));
    return newBook;
  }
}

/**
  Defines book fields.
*/
class Book {
  constructor(title, author, progress, total) {
    this.title = title;
    this.author = author;
    this.progress = progress;
    this.total = total;
  }
}

/* Get DOM elements. */
const createBookBtn = document.querySelector("#create-book-btn");
const addModal = document.querySelector("#add-modal");
const editModal = document.querySelector("#edit-modal");
const closeModalBtns = document.querySelectorAll(".close-modal-btn");
const addForm = document.querySelector(".add-book-form");
const editForm = document.querySelector(".edit-book-form");
const addBookBtn = document.querySelector("#add-book-btn");
const tableEl = document.querySelector("table");

/* Initialize */
let currentEditingIndex = -1;
let library = new Library();
console.log(localStorage.getItem("library"));
reloadTable();

createBookBtn.addEventListener("click", (e) => {
  addModal.style.display = "block";
});

closeModalBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    let modal = e.target.parentNode.parentNode.parentNode.parentNode;
    if (modal === addModal) {
      addModal.style.display = "none";
      clearInputFields(addModal);
    } else if (modal === editModal) {
      editModal.style.display = "none";
      clearInputFields(editModal);
    }
  })
);

window.onclick = function (e) {
  if (e.target === addModal) {
    addModal.style.display = "none";
    clearInputFields(addForm);
  } else if (e.target === editModal) {
    editModal.style.display = "none";
    clearInputFields(editForm);
  }
};

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!checkRequiredInputs(addForm)) {
    return;
  }

  let inputs = addForm.elements;
  let newBook = library.addBook(
    inputs["title"].value,
    inputs["author"].value,
    inputs["progress"].value,
    inputs["total"].value
  );

  addBookToTable(newBook);
  clearInputFields(addForm);
  addModal.style.display = "none";
  console.log(localStorage.getItem("library"));
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!checkRequiredInputs(editForm)) {
    return;
  }

  let inputs = editForm.elements;
  library.overwriteBook(
    currentEditingIndex,
    inputs["title"].value,
    inputs["author"].value,
    inputs["progress"].value,
    inputs["total"].value
  );

  clearInputFields(editForm);
  reloadTable();
  editModal.style.display = "none";
  console.log(localStorage.getItem("library"));
});

function checkRequiredInputs(form) {
  let allFilled = true;
  form.querySelectorAll("[required]").forEach((i) => {
    if (!i.value) {
      // TODO: change color of field to red;
      allFilled = false;
      return;
    }
  });

  return allFilled;
}

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

function clearInputFields(form) {
  form.querySelectorAll("input").forEach((i) => {
    i.value = "";
  });
}

function addEntryEventListeners() {
  editBtns = document.querySelectorAll(".edit-btn");
  removeBtns = document.querySelectorAll(".remove-btn");

  editBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentEditingIndex = index;
      editModal.style.display = "block";

      let book = library.getBook(index);
      editForm.title.value = book.title;
      editForm.author.value = book.author;
      editForm.progress.value = book.progress;
      editForm.total.value = book.total;
    });
  });

  removeBtns.forEach((btn, index) => {
    console.log("adding event listener ", index);
    btn.addEventListener("click", (e) => {
      // FIXME: this keeps propagating and deleting every book from the array
      // i think this is because event listeners are getting added every single time a new book is created
      // need to only add event listeners on creation.
      console.log(index);
      library.removeBook(index);

      let rowEl = e.target.parentElement.parentElement;
      console.log("row: " + rowEl);
      removeBookFromTable(rowEl);
      console.log(localStorage.getItem("library"));
    });
  });
}

function removeBookFromTable(rowEl) {
  rowEl.remove();
}

function reloadTable() {
  if (window.localStorage.getItem("library") != null) {
    tableEl.querySelectorAll("tr.entry").forEach((row) => {
      row.remove();
    });

    library.arr = JSON.parse(localStorage.getItem("library"));
    library.arr.forEach((book) => {
      addBookToTable(book);
    });
  }
}
