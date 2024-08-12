/*
*
*
*       Complete the API routing below
*       
*       
*/

"use strict";
const mongoose = require("mongoose");
const Book = require("../models").Book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const formatData = books.map((book) => ({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length,
        }));
        res.json(formatData);
      } catch (err) {
        res.status(500).send("no book exists");
      }
      
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      try {
        const newBook = new Book({ title, comments: [] });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (err) {
        res.send("there was an error saving");
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        res.send("error");
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;

      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send("no book exists");
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
        } else {
          res.json({
            comments: book.comments,
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          });
        }
      } catch (err) {
      res.send("no book exists");
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }

      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send("no book exists");
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
        } else {
          book.comments.push(comment);
          const savedBook = await book.save();
          res.json({
            comments: savedBook.comments,
            _id: savedBook._id,
            title: savedBook.title,
            commentcount: savedBook.comments.length,
          });
        }
      } catch (err) {
        res.send("no book exists");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;

      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send("no book exists");
      }
      
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      } catch (err){
        console.error(err); 
      }
    });
};
