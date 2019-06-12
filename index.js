//store needed elements in variables
const booksURL = "http://localhost:3000/books";

const listPanel = document.querySelector("#list-panel");
const list = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");
const currentUser = { id: 1, username: "pouros" };

//call all functions
function init() {
  getBooksFromServer();
}

//get books from server
function getBooksFromServer() {
  fetch(booksURL)
    .then(resp => resp.json())
    .then(books => renderBookList(books));
}

function renderBookListItem(book) {
  const bookTitle = document.createElement("li");
  bookTitle.innerText = book.title;

  list.append(bookTitle);

  bookTitle.addEventListener("click", () => {
    renderBook(book);
  });
}

//render all books to page
function renderBookList(books) {
  books.forEach(book => renderBookListItem(book));
}

function addUser(user, bookUsers) {
  const userLi = document.createElement("li");
  userLi.setAttribute("id", "userLi");
  userLi.innerText = user.username;

  bookUsers.append(userLi);
}

//render one book to page
function renderBook(book) {
  showPanel.innerHTML = "";

  const bookEl = document.createElement("div");

  const bookImage = document.createElement("img");
  const bookTitle = document.createElement("h2");
  const bookDesc = document.createElement("p");
  const bookUsers = document.createElement("ul");
  const readBtn = document.createElement("button");

  bookImage.setAttribute("src", book.img_url);
  bookTitle.innerText = book.title;
  bookDesc.innerText = book.description;
  readBtn.setAttribute('type', 'button')
  readBtn.innerText = "Read";

  //   bookUsers.append(user);
  bookEl.append(bookImage);
  bookEl.append(bookTitle);
  bookEl.append(bookDesc);
  bookEl.append(bookUsers);
  bookEl.append(readBtn);

  book.users.forEach(user => {
    addUser(user, bookUsers);
  });

  showPanel.append(bookEl);

  readBtn.addEventListener("click", () => {
    console.log("Users that have read this book so far:", book.users);
    if (userHasReadBook(book.users)) {
      // book.users.pop()
      book.users = book.users.filter(user => user.id != currentUser.id);

      bookUsers.innerHTML = ''

      book.users.forEach(user => {
        addUser(user, bookUsers);
      })
      showPanel.append(bookEl);
      sendPatchRequestToLikeBook(book);
    } else {
      book.users.push(currentUser);
      addUser(currentUser, bookUsers);
      sendPatchRequestToLikeBook(book);
    }
  });
}

function sendPatchRequestToLikeBook(book) {
  return fetch(`${booksURL}/${book.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  }).then(resp => resp.json());
}

function userHasReadBook(users, book) {
  const foundUser = users.find(user => user.id === currentUser.id);
  if (foundUser) {
    return true;
  } else {
    return false;
  }
}

//call inti to call functions
init();
