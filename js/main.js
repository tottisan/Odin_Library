const formElement = document.querySelector("#form");
const titleElement = document.querySelector("#title");
const authorElement = document.querySelector("#author");
const pagesElement = document.querySelector("#pages");
const checkboxElement = document.querySelector("#status");
const library = document.querySelector("#library");
const booksLibrary = document.querySelectorAll(".book__library");
const createBookElement = document.querySelector("#openNewBook");
let myBooks = [];

class Library {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  newBook();

  renderBook();

  form.reset();
});

const newBook = () => {
  const title = titleElement.value;
  const author = authorElement.value;
  const pages = pagesElement.value;
  const read = checkboxElement.value;

  const book = new Library(title, author, pages, read);

  myBooks.push(book);

  localStorage.setItem("book", JSON.stringify(myBooks));
};

/* Template to create book card with the data */
const bookTemplate = (book, index) => {
  const card = `
    <div class="book__card card-${index}">
            <div class="book__header">
              <h3 class="book__title">${book.title}</h3>
              <p class="book__author"> by ${book.author},</p>
            </div>

            <div class="book__info">
              <p class="book__pages">${book.pages} pages,</p>
              <p class="book__status">${book.read}</p>
            </div>

            <div class="book__btns">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="changeStatus"
              >
                <title>swap-horizontal</title>
                <path
                  d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="delete"
              >
                <title>trash-can-outline</title>
                <path
                  d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                />
              </svg>
            </div>
          </div>
    `;

  library.insertAdjacentHTML("beforeend", card);
};

const renderBook = () => {
  /* Remove childrens to not repeat the same book*/
  if (library.firstElementChild !== null) {
    library.replaceChildren();
  }

  /* Loop through myBooks, and append card to the DOM */
  myBooks.forEach((book, index) => {
    bookTemplate(book, index);
  });
};

/* Delete a book */
const deleteBook = (e) => {
  let parentElement = e.target.parentElement.parentElement;

  if (e.target.classList.contains("delete")) {
    e.target.parentElement.parentElement.remove();
    deleteLocalstorage(parentElement);
  }
};

/* Change read status per book */
const readStatus = (e) => {
  if (e.target.classList.contains("changeStatus")) {
    let bookRead =
      e.target.parentElement.previousElementSibling.lastElementChild;
    let parentElement = e.target.parentElement.parentElement;

    if (bookRead.textContent === "reading") {
      bookRead.textContent = "complete";
      updateLocalstorage(bookRead, parentElement);
    } else {
      bookRead.textContent = "reading";
      updateLocalstorage(bookRead, parentElement);
    }
  }
};

/* Add eventlistener to all books */
booksLibrary.forEach((book) => {
  book.addEventListener("click", (e) => {
    readStatus(e);
    deleteBook(e);
  });
});

/* Load books from localstorage and render */
const loadStorage = () => {
  let bookStorage = JSON.parse(localStorage.getItem("book"));

  if (bookStorage) {
    bookStorage.forEach((book, index) => {
      bookTemplate(book, index);
    });
  }
};

document.querySelector("DOMContentLoaded", loadStorage());

/* Open form element */
createBookElement.addEventListener("click", () => {
  formElement.classList.add("form--active");

  createBookElement.style.display = "none";
});

const updateLocalstorage = (bookRead, parentElement) => {
  let bookStorage = JSON.parse(localStorage.getItem("book"));
  /* From parentElement class, get the number of the card id */
  let bookIndex = Number(parentElement.className.split("-").slice(1));

  bookStorage.forEach((book, index) => {
    if (index === bookIndex) {
      /* Replace the read value from localstorage, with the new value from the card */
      bookStorage[index].read = bookRead.textContent;
    }

    localStorage.setItem("book", JSON.stringify(bookStorage));
  });
};

const deleteLocalstorage = (parentElement) => {
  let bookStorage = JSON.parse(localStorage.getItem("book"));
  let bookIndex = Number(parentElement.className.split("-").slice(1));

  bookStorage.forEach((book, index) => {
    if (index === bookIndex) {
      /* Delete a book from localstorage */
      bookStorage.splice(index, 1);
    }

    localStorage.setItem("book", JSON.stringify(bookStorage));
  });
};
