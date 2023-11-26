const express = require('express');
let books = require("./booksdb.js");
const { log } = require('console');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArray = Object.values(books); // Convert books object to an array


public_users.post("/register", async (req,res) => {
  const newUser= {"username":req.query.username,"password":req.query.password};
  users.push(newUser)

  res.send("The user" + (' ')+ (req.query.username) + " Has been added!")
  console.log(newUser)
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const booklist =  JSON.stringify({booksArray},null,4)
  return res.send(booklist);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
// Function to get book details based on ISBN using Promises
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = booksArray[isbn - 1];
    
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
}
const isbn = req.params.isbn;

getBookByISBN(isbn)
  .then(book => res.send(book))
  .catch(error => res.status(404).json({ message: error }));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const filteredBooks = booksArray.filter(book => book.author === author);
  
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found for the given author");
      }
    });
  }

  const author = req.params.author;

  getBooksByAuthor(author)
    .then(filteredBooks => res.send(filteredBooks))
    .catch(error => res.status(404).json({ message: error }));
  

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 function getBooksByTitle(title) {
  return new Promise((resolve,reject) => {
    const filteredBooks = booksArray.filter(book => book.title ===title);

    if(filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for the given title");
    }
  });
 }
 const title = req.params.title;

 getBooksByTitle(title)
 .then(filteredBooks => res.send(filteredBooks))
 .catch(error => res.status(404).json({message: error}))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let filtered_books =  booksArray[req.params.isbn - 1]
  return res.send(filtered_books.reviews)
});

module.exports.general = public_users;
