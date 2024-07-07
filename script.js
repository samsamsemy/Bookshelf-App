document.getElementById("book-form").addEventListener("submit", addBook);

function addBook(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const status = document.getElementById("status").value === "selesai";

  const book = {
    id: generateId(),
    title,
    author,
    year,
    isComplete: status,
  };

  saveBook(book);
  document.getElementById("book-form").reset();
  displayBooks();
}

function saveBook(book) {
  let books;
  if (localStorage.getItem("books") === null) {
    books = {
      selesai: [],
      belum: [],
    };
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }

  if (book.isComplete) {
    books.selesai.push(book);
  } else {
    books.belum.push(book);
  }

  localStorage.setItem("books", JSON.stringify(books));
}

function displayBooks() {
  const books = JSON.parse(localStorage.getItem("books"));

  const selesaiList = document.getElementById("selesai-list");
  const belumList = document.getElementById("belum-list");

  selesaiList.innerHTML = "";
  belumList.innerHTML = "";

  if (books !== null) {
    books.selesai.forEach(function (book, index) {
      const formattedDate = formatDate(book.year);

      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${formattedDate}</td><td><button onclick="moveBook(${index}, 'selesai')">Pindahkan</button><button onclick="removeBook('selesai', ${index})">Hapus</button></td>`;
      selesaiList.appendChild(tr);
    });

    books.belum.forEach(function (book, index) {
      const formattedDate = formatDate(book.year);

      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${formattedDate}</td><td><button onclick="moveBook(${index}, 'belum')">Pindahkan</button><button onclick="removeBook('belum', ${index})">Hapus</button></td>`;
      belumList.appendChild(tr);
    });
  }
}

function moveBook(index, status) {
  let books = JSON.parse(localStorage.getItem("books"));

  if (status === "selesai") {
    const bookToMove = books.selesai.splice(index, 1)[0];
    bookToMove.isComplete = false;
    books.belum.push(bookToMove);
  } else {
    const bookToMove = books.belum.splice(index, 1)[0];
    bookToMove.isComplete = true;
    books.selesai.push(bookToMove);
  }

  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

function removeBook(status, index) {
  let books = JSON.parse(localStorage.getItem("books"));

  if (status === "selesai") {
    books.selesai.splice(index, 1);
  } else {
    books.belum.splice(index, 1);
  }

  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

document.addEventListener("DOMContentLoaded", displayBooks);

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}-${formattedMonth}-${year}`;
}

function generateId() {
  return Date.now().toString();
}
