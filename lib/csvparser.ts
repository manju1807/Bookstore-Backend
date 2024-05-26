import fs from 'fs';
import { parse } from 'csv-parse';
import { db } from './db.js';
import { Book } from '../types/types.js';
import { parse as parseDate, format as formatDate } from 'date-fns';

export const csvParse = async (filePath: string, sellerId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const books: Book[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
    .on('data', (row: Book) => {
      const hasValues = Object.values(row).some(value => value !== '');
      if (hasValues) {
        books.push(row);
      }
    })
      .on('end', async () => {
        try {
          await Promise.all(books.map(async (book) => {
            const { title, author, publishedDate, price } = book;
            if (!title || !author || !publishedDate || !price) {
              console.error(`Error: Missing required fields for book ${title}`);
              return;
            }
            let formattedDate: string;
            try {
              formattedDate = formatDate(parseDate(publishedDate, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
            } catch {
              try {
                formattedDate = formatDate(parseDate(publishedDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd');
              } catch (dateError) {
                console.error(`Error parsing date ${publishedDate} for book ${title}: ${dateError}`);
                return;
              }
            }
            const formattedPrice = parseFloat(price.toString());
            const Bookdata = await db.book.create({
              data: {
                title,
                author,
                publishedDate: formattedDate,
                price: formattedPrice,
                sellerId,
              },
            });
            console.log(`Books Uploaded Succesfully: ${JSON.stringify(Bookdata)}`)
          }));

          fs.unlinkSync(filePath);
          resolve();
        } catch (error) {
          console.error(`Error processing books: ${error}`);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${error}`);
        reject(error);
      });
  });
};

process.on('exit', () => {
  db.$disconnect();
});
