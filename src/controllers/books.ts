import { db } from "../lib/db.js";
import { csvParse } from "../lib/csvparser.js";
import multer from 'multer';
import { Request, Response, RequestHandler } from 'express';
const upload = multer({ dest: 'uploads/' });

// CRUD operations

// Upload books handler
export const uploadBooks: RequestHandler[] = [
  upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (req.user) {
        if (req.user.role!== 'SELLER') return res.status(403).send('Access denied.');
        if (!req.file) return res.status(400).send('No file uploaded.');
        const sellerId = req.user.id;
        const filePath = req.file.path;
        try {
          await csvParse(filePath, sellerId);
          res.status(200).send('CSV file successfully processed');
        } catch (error) {
          res.status(500).json({ error: error });
        }
      }
    } catch (error) {
      res.json({error:error})
    }
  }
];

// get all books handler
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await db.book.findMany();
    if (books) res.status(200).json(books);
  } catch (error) {
    res.json({ error: error });
  }
};

// get book by Id handler
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await db.book.findUnique({
    where: { id: req.params.id }
    });
    if(book) res.status(200).json(book)
  } catch (error) {
    res.json({ error: error });
  }
};

// edit book By id handler
export const editBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publishedDate, price } = req.body;
    const bookId = req.params.id;
    const user = (req as any).user;
    if (!user || user.role !== 'SELLER') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const book = await db.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }
    if (book.sellerId !== user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const updatedBook = await db.book.update({
      where: { id: bookId },
      data: { title, author, publishedDate, price },
    });
    return res.status(200).json({ success: true, message: 'Book updated successfully.', updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.', error });
  }
};


// delete book By id handler
export const deleteBook = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      if (req.user.role !== 'SELLER') return res.status(403).send('Access denied.');
      const { id } = req.params;
      const book = await db.book.findUnique({ where: { id } });
      if (book) {
        if (book.sellerId !== req.user.id) return res.status(403).send('Access denied.');
        await db.book.delete({ where: { id } });
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Book not found!!' })
      }
    }
  } catch (error) { 
    res.json({error:error})
  }
};
