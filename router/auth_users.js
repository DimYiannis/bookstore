const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
  return user.username === username})
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Invalid Credentials"});
    }

    if (!isValid(username)) {
      return res.status(401).json({ message: "User not found" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log(users);
  const username = req.body.username;
  const isbn = req.body.isbn;
  
  
  if (!isValid(username)) {
    return res.status(401).json({ message: "User not found" });
  }

  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Review parameter is required" });
  }
  books[isbn].reviews = review

  return res.status(200).json({ message: `Review for ISBN ${isbn} added successfully` });
});

//delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const isbn = req.body.isbn;

  if (!isValid(username)) {
    return res.status(401).json({ message: "User not found" });
  }

  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  // Check if the review exists
  if (!books[isbn].reviews) {
    return res.status(404).json({ message: `No review found for ISBN ${isbn}` });
  }

  // Delete the review
  delete books[isbn].reviews;

  return res.status(200).json({ message: `Review for ISBN ${isbn} deleted successfully` });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
