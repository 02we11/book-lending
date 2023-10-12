const addButton = document.querySelector('.button-add');
const displayButton = document.querySelector('.button-display');
const bookList = document.querySelector('.book-list');
const statusMessage = document.querySelector('.status-message');

let books = JSON.parse(localStorage.getItem('books')) || [];
let displayAllBooks = false;

addButton.addEventListener('click', addBook);
displayButton.addEventListener('click', toggleDisplay);

function addBook() {
    const bookTitle = prompt('本のタイトルを入力してください:');
    if (bookTitle) {
        const newBook = {
            title: bookTitle,
            status: '貸出可能',
            id: Date.now()
        };
        books.push(newBook);
        saveBooksToLocalStorage();
        if (displayAllBooks || newBook.status === '貸出中') {
            displayBook(newBook);
        }
    }
}

function displayBook(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    bookItem.innerHTML = `
        <h2>${book.title}</h2>
        <p>ステータス: ${book.status}</p>
        <div class="buttons-container">
            <button class="button delete-button">削除</button>
            <button class="button lend-button">貸出/返却</button>
        </div>
    `;
    bookList.appendChild(bookItem);

    const lendButton = bookItem.querySelector('.lend-button');
    lendButton.addEventListener('click', () => {
        const index = books.findIndex(b => b.id === book.id);
        if (books[index].status === '貸出可能') {
            books[index].status = '貸出中';
        } else {
            books[index].status = '貸出可能';
        }
        saveBooksToLocalStorage();
        bookItem.querySelector('p').textContent = `ステータス: ${books[index].status}`;
    });

    const deleteButton = bookItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        const index = books.findIndex(b => b.id === book.id);
        books.splice(index, 1);
        saveBooksToLocalStorage();
        bookItem.remove();
    });
}

function toggleDisplay() {
    displayAllBooks = !displayAllBooks;
    bookList.innerHTML = '';
    if (displayAllBooks) {
        statusMessage.textContent = 'すべての本を表示しています';
        books.forEach(book => {
            displayBook(book);
        });
    } else {
        statusMessage.textContent = '貸出中の本を表示しています';
        const lendBooks = books.filter(book => book.status === '貸出中');
        lendBooks.forEach(book => {
            displayBook(book);
        });
    }
}

function saveBooksToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

toggleDisplay();
