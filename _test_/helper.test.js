import { createResponse, getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../helper';
import { getDBPool } from '../dbConfig';
import { validateformData } from '../dataValidation';

// Mock the dependencies
jest.mock('../dbConfig');
jest.mock('../dataValidation');

describe('Helper Functions', () => {
  // Test createResponse
  describe('createResponse', () => {
    it('should create correct response object', () => {
      const response = createResponse(200, { message: 'Success' });
      expect(response).toEqual({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'Success' })
      });
    });
  });

  // Test getAllBooks
  describe('getAllBooks', () => {
    it('should return all books when records exist', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [
            { id: 1, title: 'Book 1' },
            { id: 2, title: 'Book 2' }
          ]
        })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await getAllBooks();
      expect(result.message).toBe('Data fetch successfuly');
      expect(result.data).toHaveLength(2);
    });

    it('should handle empty results', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await getAllBooks();
      expect(result.message).toBe('Books record not found');
      expect(result.data).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockPool = {
        query: jest.fn().mockRejectedValue(new Error('DB error'))
      };
      getDBPool.mockResolvedValue(mockPool);

      await expect(getAllBooks()).rejects.toThrow('Error fetching books: DB error');
    });
  });

  // Test getBookById
  describe('getBookById', () => {
    it('should return book when found', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 1, title: 'Test Book' }]
        })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await getBookById(1);
      expect(result.message).toBe('Book found successfully');
      expect(result.data).toEqual({ id: 1, title: 'Test Book' });
    });

    it('should throw error when book not found', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] })
      };
      getDBPool.mockResolvedValue(mockPool);

      await expect(getBookById(999)).rejects.toThrow('Error fetching book: Book record not found');
    });
  });

  // Test createBook
  describe('createBook', () => {
    const mockBookData = {
      title: 'New Book',
      author: 'Author',
      price: 29.99,
      isbn: '123456789'
    };

    it('should create book when validation passes', async () => {
      validateformData.mockReturnValue({ isValid: true });
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ ...mockBookData, id: 1 }]
        })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await createBook(mockBookData);
      expect(result).toEqual({ ...mockBookData, id: 1 });
    });

    it('should throw error when validation fails', async () => {
      validateformData.mockReturnValue({ 
        isValid: false, 
        errors: ['Title is required'] 
      });

      await expect(createBook(mockBookData))
        .rejects.toThrow('Validation failed: Title is required');
    });
  });

  // Test updateBook
  describe('updateBook', () => {
    const mockBookData = {
      title: 'Updated Book',
      author: 'Author',
      price: 39.99,
      isbn: '987654321'
    };

    it('should update book when found and validation passes', async () => {
      validateformData.mockReturnValue({ isValid: true });
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ ...mockBookData, id: 1 }]
        })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await updateBook(1, mockBookData);
      expect(result.message).toBe('Book record updated successfully');
      expect(result.data).toEqual({ ...mockBookData, id: 1 });
    });

    it('should throw error when book not found', async () => {
      validateformData.mockReturnValue({ isValid: true });
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] })
      };
      getDBPool.mockResolvedValue(mockPool);

      await expect(updateBook(999, mockBookData))
        .rejects.toThrow('Error updating book: Book record not found');
    });
  });

  // Test deleteBook
  describe('deleteBook', () => {
    it('should delete book when found', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 1, title: 'Deleted Book' }]
        })
      };
      getDBPool.mockResolvedValue(mockPool);

      const result = await deleteBook(1);
      expect(result.message).toBe('Book record deleted successfully');
      expect(result.data).toEqual({ id: 1, title: 'Deleted Book' });
    });

    it('should throw error when book not found', async () => {
      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: [] })
      };
      getDBPool.mockResolvedValue(mockPool);

      await expect(deleteBook(999))
        .rejects.toThrow('Error deleting book: Book record not found');
    });
  });
});
