document.addEventListener("DOMContentLoaded", init);

const BASE_URL = `http://localhost:3000/books/`;
const BOOK_LIST = document.querySelector("#list");
const BOOK_PANEL = document.querySelector("#show-panel");

function getBooks() {
  return fetch(BASE_URL).then(data => data.json());
}

function getSingleBook(id) {
  return fetch(BASE_URL + `${id}`).then(data => data.json());
}

function addBookToList(book) {
  const bookListEl = document.createElement("li");
  bookListEl.innerText = book.title;
  bookListEl.dataset.id = book.id;
  bookListEl.addEventListener("click", onBookClick);

  BOOK_LIST.append(bookListEl);
}

function onBookClick(event) {
  getSingleBook(event.target.dataset.id).then(displayBook);
}

function displayBook(book) {
  BOOK_PANEL.innerHTML = "";

  const bookTitle = document.createElement("h1");
  bookTitle.innerText = book.title;

  const bookImg = document.createElement("img");
  bookImg.src = book.img_url;

  const bookDescription = document.createElement("p");
  bookDescription.innerText = book.description;

  const likeButton = document.createElement("button");
  likeButton.innerText = "Like Book";
  likeButton.addEventListener("click", () => likeBook(book));

  const likes = document.createElement("ul");
  book.users.forEach(function(user) {
    const likeEl = document.createElement("li");
    likeEl.innerText = user.username;
    likes.append(likeEl);
  });

  BOOK_PANEL.append(bookTitle, bookImg, bookDescription, likeButton, likes);
}

function likeBook(book) {
  let userObj = { id: 1, username: "pouros" };
  book.users.push(userObj);
  debugger;

  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(book)
  };
  fetch(BASE_URL + `${book.id}`, configObj)
    .then(function(response) {
      return response.json();
    })
    .then(displayBook);
}

function addAllBooksToList(bookArray) {
  BOOK_LIST.innerHTML = "";
  bookArray.forEach(addBookToList);
}

function init() {
  console.log("Hello awesome developer");
  getBooks().then(addAllBooksToList);
}
