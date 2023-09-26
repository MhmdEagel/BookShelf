const bookShelf = []
const RENDER_EVENT = 'render-book';
const inputBook = document.getElementById("inputBook")
const title = document.getElementById("title");
const author = document.getElementById("author");
const year = document.getElementById("year");
const isComplete = document.getElementById("read");
const subBtn = document.getElementById("submit-btn");

function saveBookData () {
	localStorage.setItem("BOOK_DATA", JSON.stringify(bookShelf));
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadBookData () {
	let dataLoaded = JSON.parse(localStorage.getItem("BOOK_DATA"));

	if (dataLoaded !== null) {
		for (const book of dataLoaded) {
			bookShelf.push(book);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateBookObject ( id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year,
		isComplete
	}

}

function findBook (bookId) {
	for (const bookItem of bookShelf) {
		if(bookItem.id === bookId) {
			return bookItem
		}
	}
	return null;
}

function findBookIndex (bookId) {
	for (const index in bookShelf) {
		if (bookShelf[index].id === bookId) {
			return index;
		}
	}
	return -1;
}

function addBookToAlready (bookId) {
	const bookTarget = findBook(bookId);

	if(bookTarget == null) return;

	bookTarget.isComplete = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData()
}

function addBookToUnread (bookId) {
	const bookTarget = findBook(bookId);
	if(bookTarget == null) return;

	bookTarget.isComplete = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData()
}

function removeBook (bookId) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	bookShelf.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData()
}



function makeBook (bookObject) {
	const {id, title, author, year, isComplete} = bookObject;

	const bookTitle = document.createElement("h2");
	bookTitle.innerText = title;
	bookTitle.classList.add("item-title")

	const bookAuthor = document.createElement("p");
	bookAuthor.innerText = `Author: ${author}`;

	const bookYear = document.createElement("p");
	bookYear.innerText = `Year: ${year}`;

	const trashBtn = document.createElement("button")
	trashBtn.classList.add("btn-trash");
	trashBtn.addEventListener("click", function() {
		removeBook(id);
	})

	const bookContainer = document.createElement("div");
	const actionContainer = document.createElement("div");

	actionContainer.classList.add("action")
	bookContainer.classList.add('item', 'card');
	bookContainer.append(bookTitle, bookAuthor, bookYear);
	bookContainer.append(actionContainer)
	bookContainer.setAttribute('id', `book-${id}`)

	if (isComplete) {
		const readBtn = document.createElement("button");
		readBtn.classList.add("btn-unread");
		readBtn.addEventListener("click", function() {
			addBookToUnread(id);
		})

		actionContainer.append(readBtn, trashBtn);
	} else {
		const doneBtn = document.createElement("button");
		doneBtn.classList.add("btn-done");
		doneBtn.addEventListener("click", function() {
			addBookToAlready(id)
		}) 

		actionContainer.append(doneBtn, trashBtn);
	}

	return bookContainer;

}


function addBook() {
	const titleValue = title.value;
	const authorValue = author.value;
	const yearValue = year.value;
	const isCompleteValue = isComplete.checked;

	const generateId = +new Date();
	const bookObject = generateBookObject(generateId, titleValue, authorValue, yearValue, isCompleteValue);

	bookShelf.push(bookObject);
	
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveBookData()

}

document.addEventListener('DOMContentLoaded', function() {

	const inputBook = document.getElementById("input-book");

	inputBook.addEventListener('submit', function(event) {
		event.preventDefault();
		addBook();
	});

	loadBookData();



})


document.addEventListener(RENDER_EVENT, function () {
	const unreadList = document.getElementById("unRead");
	const alreadyList = document.getElementById("alrRead");


	unreadList.innerHTML = '';
	alreadyList.innerHTML = '';






	for (const bookItem of bookShelf) {
		const bookElement = makeBook(bookItem);
		if(bookItem.isComplete) {
			alreadyList.append(bookElement);
		} else {
			unreadList.append(bookElement);
		}
	}


})

