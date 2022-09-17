const Books = []

const book = { title: 'titles', num: 34 }
Books.push(book);

if (!(Books.includes(book))) {
    Books.push(book);
    console.log(' Not included');
}

console.log(Books);
