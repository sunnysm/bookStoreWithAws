
export const validateformData = (formData) => {
    const errors = [];

    // First check if formData exists and is not empty
    if (!formData || Object.keys(formData).length === 0) {
        return {
            isValid: false,
            errors: ['Book data is empty']
        };
    }

    /* Here we are checking, all required fields are present in request body */
    if (!formData.title) errors.push('Title is required');
    if (!formData.author) errors.push('Author is required');
    if (!formData.price) errors.push('Price is required');
    if (!formData.isbn) errors.push('ISBN is required');

    /* Here we are checking, all required fields have valid data types and formats */
    if (typeof formData.title !== 'string') errors.push('Title must be a string');
    if (typeof formData.author !== 'string') errors.push('Author must be a string');
    if (formData.price && typeof formData.price !== 'number') errors.push('Price must be a number');
    if (formData.isbn && typeof formData.isbn !== 'string') errors.push('ISBN must be a string');

    /* Here we are checking, additional validation rules*/
    if (formData.price && formData.price <= 0) errors.push('Price must be greater than 0');
    if (formData.isbn && formData.isbn && !/^\d{10}(\d{3})?$/.test(formData.isbn)) errors.push('Invalid ISBN format');
  
    return { isValid: errors.length === 0,  errors };
};