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


export const getBooks = async (req: Request, res: Response) => {
  const books = await db.book.findMany();
};

export const getBookById = async (req: Request, res: Response) => {

};

export const editBook = async (req: Request, res: Response) => {

};

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
