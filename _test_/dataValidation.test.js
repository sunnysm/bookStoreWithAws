import { validateformData } from '../dataValidation.js';

describe('validateFormData', () => {
    // Test empty form data
    test('should return error when form data is empty', () => {
        const result = validateformData({});
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Book data is empty');
    });

    // Test required fields
    test('should validate required fields', () => {
        const result = validateformData({
            title: '',
            author: '',
            price: null,
            isbn: ''
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
        expect(result.errors).toContain('Author is required');
        expect(result.errors).toContain('Price is required');
        expect(result.errors).toContain('ISBN is required');
    });

    // Test data type validations
    test('should validate data types', () => {
        const result = validateformData({
            title: 123,
            author: 456,
            price: "50",
            isbn: 123
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title must be a string');
        expect(result.errors).toContain('Author must be a string');
        expect(result.errors).toContain('Price must be a number');
        expect(result.errors).toContain('ISBN must be a string');
    });

    // Test price validation
    test('should validate price is greater than 0', () => {
        const result = validateformData({
            title: "Book Title",
            author: "Author Name",
            price: -10,
            isbn: "1234567890"
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Price must be greater than 0');
    });

    // Test ISBN format
    test('should validate ISBN format', () => {
        const result = validateformData({
            title: "Book Title",
            author: "Author Name",
            price: 29.99,
            isbn: "123abc"
        });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid ISBN format');
    });

    // Test valid data
    test('should pass with valid data', () => {
        const result = validateformData({
            title: "Valid Book Title",
            author: "Valid Author Name",
            price: 29.99,
            isbn: "1234567890"
        });
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    // Test ISBN with 13 digits
    test('should accept 13-digit ISBN', () => {
        const result = validateformData({
            title: "Book Title",
            author: "Author Name",
            price: 29.99,
            isbn: "1234567890123"
        });
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
});
