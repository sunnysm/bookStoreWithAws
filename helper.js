import { getDBPool } from './dbConfig.js';
import { validateformData } from './dataValidation.js';

export const createResponse = (statusCode, data) => {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
};

// Get all books records
export const getAllBooks = async () => {
  try {
    const pool = await getDBPool();
    const result = await pool.query('SELECT * FROM books');
    return {
      message: result.rows?.length ? 'Data fetch successfuly' : 'Books record not found',
      data: result.rows
    };
  } catch (error) {
    throw new Error(`Error fetching books: ${error.message}`);
  }
};
// Get book by book ID
export const getBookById = async (id) => {
  try {
    const pool = await getDBPool();
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Book record not found');
    }
    return {
      message: 'Book found successfully',
      data: result.rows[0]
    };
  } catch (error) {
    throw new Error(`Error fetching book: ${error.message}`);
  }
};
/** 
 * Create book record function to insert book object in DB
 * Accept books abject and return inserted record
 * @param {Object} book - The book object to be created
 * @returns {Object} - The created book object
 */
export const createBook = async (formData) => {
  const dataValidation = validateformData(formData);
  if (!dataValidation.isValid) {
    throw new Error(`Validation failed: ${dataValidation.errors.join(', ')}`);
  }

  const query = 'INSERT INTO books (title, author, price, isbn) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [formData.title, formData.author, formData.price, formData.isbn];
  try {
    const pool = await getDBPool();
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error while creating inserting book record: ${error.message}`);
  }
};
/**
 * Update book record function to update book object in DB
 * Accept book ID and book object and return updated record
 * @param {*} id 
 * @param {*} book 
 * @returns 
 */
export const updateBook = async (id, book) => {
  const dataValidation = validateformData(book);
  if (!dataValidation.isValid) {
    throw new Error(`Validation failed: ${dataValidation.errors.join(', ')}`);
  }

  const query = 'UPDATE books SET title = $1, author = $2, price = $3, isbn = $4 WHERE id = $5 RETURNING *';
  const values = [book.title, book.author, book.price, book.isbn, id];

  try {
    const pool = await getDBPool();
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Book record not found');
    }
    return {
      message: 'Book record updated successfully',
      data: result.rows[0]
    };
  } catch (error) {
    throw new Error(`Error updating book: ${error.message}`);
  }
};
/**
 * Delete book record function to delete book object in DB
 * Accept book ID and return deleted record
 * @param {*} id 
 * @returns 
 */
export const deleteBook = async (id) => {
  try {
    const pool = await getDBPool();
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Book record not found');
    }
    return {
      message: 'Book record deleted successfully',
      data: result.rows[0]
    };
  } catch (error) {
    throw new Error(`Error deleting book: ${error.message}`);
  }
};