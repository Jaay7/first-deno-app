import { serve } from 'https://deno.land/std/http/server.ts'
import { Application, Router } from 'https://deno.land/x/oak/mod.ts'

interface Book {
  id: string
  title: string
  author: string
}

let books: Array<Book> = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
  { id: '3', title: 'Book 3', author: 'Author 3' },
];

export const getBooks = ({ response }: { response: any }) => {
  response.body = books;
};

export const getBook = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  const book: Book | undefined = books.find((book) => book.id == params.id);
  if (book) {
    response.status = 200;
    response.body = book;
    return;
  }
  response.status = 404;
  response.body = { msg: 'Book not found' };
};

export const addBook = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = { msg: 'Invalid payload' };
    return;
  }
  const book: Book = body.value;
  books.push(book);
  response.body = { msg: 'Book added successfully' };
};

export const updateBook = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  const book: Book | undefined = books.find((book) => book.id == params.id);
  if (book) {
    const body = await request.body();
    const updateData: { title?: string; author?: string } = body.value;
    book.title = updateData.title ?? book.title;
    book.author = updateData.author ?? book.author;
    response.body = { msg: 'Book updated successfully' };
    return;
  }
  response.status = 404;
  response.body = { msg: 'Book not found' };
};

export const deleteBook = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  books = books.filter((book) => book.id != params.id);
  response.body = { msg: 'Book removed successfully' };
};



const env = Deno.env.toObject()
const PORT = env.PORT || 5000
const HOST = env.HOST || '127.0.0.1'

const router = new Router()

router
  .get('/books', getBooks)
  .get('/books/:id', getBook)
  .post('/books', addBook)
  .put('/books/:id', updateBook)
  .delete('/books/:id', deleteBook)

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Listening on port ${PORT}`)

await app.listen(`${HOST}:${PORT}`)