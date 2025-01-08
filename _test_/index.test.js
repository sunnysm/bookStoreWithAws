import { handler } from '../index.js';
import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../helper.js';

// Mock the helper functions
jest.mock('../helper.js');

describe('Book Store API Handler', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test GET all books
  test('GET /books should return all books', async () => {
    const mockBooks = [
      { id: '1', title: 'Book 1' },
      { id: '2', title: 'Book 2' }
    ];
    getAllBooks.mockResolvedValue(mockBooks);

    const event = {
      httpMethod: 'GET',
      path: '/books'
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockBooks);
  });

  // Test GET book by ID
  test('GET /books/{id} should return a specific book', async () => {
    const mockBook = { id: '1', title: 'Book 1' };
    getBookById.mockResolvedValue(mockBook);

    const event = {
      httpMethod: 'GET',
      path: '/books/1',
      pathParameters: { id: '1' }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockBook);
  });

  // Test POST new book
  test('POST /books should create a new book', async () => {
    const newBook = { title: 'New Book', author: 'Author' };
    const createdBook = { id: '3', ...newBook };
    createBook.mockResolvedValue(createdBook);

    const event = {
      httpMethod: 'POST',
      path: '/books',
      body: JSON.stringify(newBook)
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(createdBook);
  });

  // Test PUT update book
  test('PUT /books/{id} should update a book', async () => {
    const updateData = { title: 'Updated Book' };
    const updatedBook = { id: '1', ...updateData };
    updateBook.mockResolvedValue(updatedBook);

    const event = {
      httpMethod: 'PUT',
      path: '/books/1',
      pathParameters: { id: '1' },
      body: JSON.stringify(updateData)
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(updatedBook);
  });

  // Test DELETE book
  test('DELETE /books/{id} should delete a book', async () => {
    const deletedBook = { id: '1', title: 'Deleted Book' };
    deleteBook.mockResolvedValue(deletedBook);

    const event = {
      httpMethod: 'DELETE',
      path: '/books/1',
      pathParameters: { id: '1' }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(deletedBook);
  });
});
