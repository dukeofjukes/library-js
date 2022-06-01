/**
 * Defines book fields.
 */
class Book {
  constructor(id, title, author, progress, total) {
    this.id = id; // a hidden unique ID to identify the book
    this.title = title;
    this.author = author;
    this.progress = progress;
    this.total = total;
  }
}

/**
 * Manages the library array and local storage.
 */
class Library {
  /**
   * Generate a new unique ID for a new book.
   * @returns a unique ID for the book
   */
  static getNewID() {
    let id;
    if (localStorage.getItem("globalID") === null) {
      id = 0;
    } else {
      console.log(localStorage.getItem("globalID"));
      id = JSON.parse(localStorage.getItem("globalID"));
    }

    localStorage.setItem("globalID", (id + 1) % Number.MAX_SAFE_INTEGER);

    return id;
  }

  static get() {
    if (localStorage.getItem("library") != null) {
      return JSON.parse(localStorage.getItem("library"));
    }

    return [];
  }

  static getBookFromID(id) {
    const lib = Library.get();
    let target = null;

    lib.forEach((book) => {
      if (book.id === id) {
        target = book;
      }
    });

    return target;
  }

  static getBookIndexFromID(id) {
    const lib = Library.get();
    let target = null;

    lib.forEach((book, index) => {
      if (book.id === id) {
        target = index;
      }
    });

    return target;
  }

  static addBook(title, author, progress, total) {
    const id = Library.getNewID();
    const lib = Library.get();
    let newBook = new Book(id, title, author, progress, total);
    lib.push(newBook);
    localStorage.setItem("library", JSON.stringify(lib));
    return newBook;
  }

  static removeBook(id) {
    const lib = Library.get();

    lib.forEach((book, index) => {
      if (book.id === id) {
        lib.splice(index, 1);
      }
    });

    localStorage.setItem("library", JSON.stringify(lib));
  }

  static overwriteBook(id, title, author, progress, total) {
    let index = this.getBookIndexFromID(id);
    const lib = Library.get();

    lib[index].title = title;
    lib[index].author = author;
    lib[index].progress = progress;
    lib[index].total = total;

    localStorage.setItem("library", JSON.stringify(lib));
    return lib[index];
  }
}

/**
 * Handles UI updates.
 */
class UI {
  static displayBooks() {
    const lib = Library.get();
    lib.forEach((book) => UI.addBookToTable(book));
  }

  static createRow(book) {
    return `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td class="num">${book.progress}/${book.total}</td>
      <td class="btn-cell">
        <button class="edit-btn">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
  }

  static addBookToTable(book) {
    const table = document.querySelector("#library");
    const row = document.createElement("tr");
    row.id = String(book.id);
    row.innerHTML = this.createRow(book);
    table.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("remove-btn")) {
      el.parentElement.parentElement.remove();
    }
  }

  static reloadBook(book) {
    const table = document.querySelector("#library");
    table.childNodes.forEach((row, index) => {
      if (Number(row.id) === book.id) {
        table.deleteRow(index);
        let row = table.insertRow(index);
        row.innerHTML = this.createRow(book);
      }
    });
  }

  static clearFields(form) {
    form.querySelectorAll("input").forEach((i) => {
      i.value = "";
    });
  }

  static checkRequiredInputs(form) {
    let allFilled = true;
    form.querySelectorAll("[required]").forEach((i) => {
      if (!i.value) {
        allFilled = false;
        return;
      }
    });
    return allFilled;
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

let editingID = -1;

document.addEventListener("DOMContentLoaded", UI.displayBooks());

document.querySelector("#library").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    Library.removeBook(Number(e.target.parentElement.parentElement.id));
    UI.deleteBook(e.target);
  } else if (e.target.classList.contains("edit-btn")) {
    // show and load edit modal
    editingID = Number(e.target.parentElement.parentElement.id);
    let book = Library.getBookFromID(editingID);

    if (book != null) {
      editForm.title.value = book.title;
      editForm.author.value = book.author;
      editForm.progress.value = book.progress;
      editForm.total.value = book.total;
    }

    editModal.style.display = "block";
  }
});

createBookBtn.addEventListener("click", (e) => {
  addModal.style.display = "block";
});

closeModalBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-modal-btn")) {
      let modal = e.target.parentNode.parentNode.parentNode;
      if (modal === addModal) {
        addModal.style.display = "none";
        UI.clearFields(addForm);
      } else if (modal === editModal) {
        editModal.style.display = "none";
        UI.clearFields(editForm);
      }
    }
  })
);

window.onclick = function (e) {
  if (e.target === addModal) {
    addModal.style.display = "none";
    UI.clearFields(addForm);
  } else if (e.target === editModal) {
    editModal.style.display = "none";
    UI.clearFields(editForm);
  }
};

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!UI.checkRequiredInputs(addForm)) {
    return;
  }

  let inputs = addForm.elements;
  let newBook = Library.addBook(
    inputs["title"].value,
    inputs["author"].value,
    inputs["progress"].value,
    inputs["total"].value
  );

  console.log(newBook);

  UI.addBookToTable(newBook);
  UI.clearFields(addForm);
  addModal.style.display = "none";
  console.log(localStorage.getItem("library"));
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!UI.checkRequiredInputs(editForm)) {
    return;
  }

  let inputs = editForm.elements;

  let newBook = Library.overwriteBook(
    editingID,
    inputs["title"].value,
    inputs["author"].value,
    inputs["progress"].value,
    inputs["total"].value
  );

  UI.reloadBook(newBook);
  UI.clearFields(editForm);
  editModal.style.display = "none";
});
