// User interface definition
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

// Book interface definition
export interface Book {
  title: string;
  author: string;
  publishedDate: string;
  price: number;
  sellerId: string;
}

// Type alias for an array of books
export type Books = Book[];

// Extended request interface for multer
export interface MulterRequest extends Request {
  file: Express.Multer.File;
  user: {
    id: string;
  };
}