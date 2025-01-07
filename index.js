import {
  createResponse,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from './helper.js';

export const handler = async (event) => {
  try {
    const { httpMethod, path, body, pathParameters } = event;
    let response;
    switch(httpMethod) {
      case 'POST':
        const newBook = JSON.parse(body);
        response = await createBook(newBook);
        break;
      case 'GET':
        if (pathParameters && pathParameters.id) {
          response = await getBookById(pathParameters.id);
        } else {
          response = await getAllBooks();
        }
        break;
      case 'PUT':
        if (pathParameters && pathParameters.id) {
          const updateData = JSON.parse(body);
          response = await updateBook(pathParameters.id, updateData);
        }
        break;
      case 'DELETE':
        if (pathParameters && pathParameters.id) {
          response = await deleteBook(pathParameters.id);
        }
        break;
      default:
        throw new Error(`Unsupported method: ${httpMethod}`);
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    if (error.message.includes('Validation failed')) {
      return createResponse(400, {
        success: false,
        message: error.message
      });
    } else if (error.message.includes('Book record not found')) {
      return createResponse(404, {
        message: 'Book record not found',
        data: null
      });
    }
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
