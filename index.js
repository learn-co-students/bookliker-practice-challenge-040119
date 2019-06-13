// document.addEventListener("DOMContentLoaded", function() {});


//---------------------- global varibales ----------------------//

const bookUl = document.querySelector('#list')
const bookShowPanel = document.querySelector('#show-panel')

let currentUser = {id: 1, username: "pouros"}

//---------------------- server side ----------------------//
const BOOK_URL = 'http://localhost:3000/books'

const fetchBooks = () => {
    return fetch(BOOK_URL).then(resp=> resp.json())
}

const increaseLikesOnServer = book => {
    return fetch(BOOK_URL + `/${book.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book)
    }).then(resp => resp.json())
}

//---------------------- initialise function ----------------//

const init = () => {
    fetchBooks().then(renderBooks)
}

//---------------------- client side ----------------------//

const renderBooks = books => {
    books.forEach(renderBook)
}

const renderBook = book => {
    const bookLi = document.createElement('li')

    bookLi.innerText = book.title

    bookUl.append(bookLi)

    bookLi.addEventListener('click', () => renderShowBook(book))

}

const renderShowBook = book => {
    bookShowPanel.innerHTML = ``
    const titleEl = document.createElement('h1')
    const imgEl = document.createElement('img')
    const descriptionEl = document.createElement('p')
    const usersListEl = document.createElement('ul')
    const likeBtn = document.createElement('button')

    titleEl.innerText = book.title
    imgEl.src = book.img_url
    descriptionEl.innerText = book.description
    likeBtn.innerText = 'Like'

    renderUsers(book.users, usersListEl)

    bookShowPanel.append(titleEl, imgEl, descriptionEl, usersListEl, likeBtn)

    likeBtn.addEventListener('click', () => likeABook(book, usersListEl))
}

const renderUsers = (users, usersListEl) => {
    usersListEl.innerHTML = ``

    users.forEach(user => {
        const userLi = document.createElement('li')
        userLi.innerText = user.username
        usersListEl.append(userLi)
    })
}

const likeABook = (book, usersListEl) => {
   if (book.users.find(user => user.id === currentUser.id)) {
       book.users = book.users.filter(user => user.id !== currentUser.id)
   } else {
       book.users.push(currentUser)
   }

   increaseLikesOnServer(book)
    .then(book => renderUsers(book.users, usersListEl))
}

init()