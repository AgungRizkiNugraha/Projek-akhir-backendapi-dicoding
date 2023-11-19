/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
const { nanoid } = require('nanoid');
const books = require('./books');

//tambah buku
const addbooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const isfinished = (readPage, pageCount) => {
    if (readPage === pageCount) {
      return true;
    }
    if (readPage < pageCount) {
      return false;
    }
  };
  const finished = isfinished(readPage, pageCount);

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, finished, id, insertedAt, updatedAt,
  };

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};

//Menampilkan semua buku
const getAllbooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h
      .response({
        status: 'success',
        data: {
          books: BooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  } if (reading !== undefined) {
    const BooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: BooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }
  if (finished !== undefined) {
    const filterBookByFinished = books.filter((book) => Number(finished) === Number(book.finished));

    const response = h.response({
      status: 'success',
      data: {
        books: filterBookByFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

//Menampilkan buku berdasarkan id
const getbooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

//edit buku
const editbooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

//Hapusbuku
const deletebooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addbooksHandler,
  getAllbooksHandler,
  getbooksByIdHandler,
  editbooksByIdHandler,
  deletebooksByIdHandler,
};
