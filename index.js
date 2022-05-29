class Library {
  constructor() {
    this.arr = [];
  }

  addBook(title, author, progress, total) {
    let newBook = new Book(title, author, progress, total);
    this.arr.push(newBook);

    return newBook;
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

let library = new Library();

const formEl = document.querySelector(".add-book-form");
const addBookBtn = document.querySelector("#add-book-btn");
const tableEl = document.querySelector("table");

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

  // clear inputs
  formEl.querySelectorAll("input").forEach((i) => {
    i.value = "";
  });
});

function addBookToTable(book) {
  let row = tableEl.insertRow(-1);
  row.classList.add("entry");
  row.innerHTML += `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class="num">${book.progress}</td>
    <td class="num">${book.total}</td>
  `;
  // TODO: add remove and edit btn
}

// TODO:
// function removeBookFromTable(index) {}
