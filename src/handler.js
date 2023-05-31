const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  // books.push(newBook);

  // const isSuccess = newBook.filter((book) => book.id === id).length > 0;
  if (newBook) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    } if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        // eslint-disable-next-line max-len
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    books.push(newBook);
    response.code(201);
    return response;
  }
  ;
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  // const {id, name, publisher} = request.payload;
  const {name, reading, finished} = request.query;
  const bookRead = books.filter((b) => b.reading == reading).slice();
  const bookFinished = books.filter((b) => b.finished== finished).slice();
  const bookName = name ? books.filter((b) => b.name.toUpperCase()
      .includes(name.toUpperCase())).slice() : false;


  if (reading) {
    return {
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: bookRead.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
      },
    };
  } if (finished) {
    return {
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: bookFinished.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
      },
    };
  } if (name) {
    return {
      status: 'success',
      data: {
        // eslint-disable-next-line max-len
        books: bookName.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
      },
    };
  }
  const response = h.response({
    status: 'success',
    data: {
      // eslint-disable-next-line max-len
      books: books.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
    },
  });
  response.code(200);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const {id} = request.params;

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

const editBooksByIdHandler = (request, h) => {
  const {id} = request.params;

  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    } if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        // eslint-disable-next-line max-len
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
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

const deleteBooksByIdHandler = (request, h) => {
  const {id} = request.params;
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
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
