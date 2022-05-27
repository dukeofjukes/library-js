const tableEl = document.querySelector("table");
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const pagesReadInput = document.querySelector("#pages-read-input");
const totalPagesInput = document.querySelector("#total-pages-input");
const addBookBtn = document.querySelector("#add-book-btn");

addBookBtn.addEventListener("click", () => {
  addBookToLibrary();
});

let myLibrary = [];

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

function addBookToLibrary() {
  console.log("added");
  // check if any field is empty, and change its color
  // get book info from gui
  // let newBook = Object.create(Book(title, author, isbn));
  // myLibrary.append(newBook)
  // update tableEl (write a function?)
  // TODO: make library a class?
}
