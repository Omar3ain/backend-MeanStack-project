import 'dotenv/config';
import 'module-alias/register';
import mainRouter from '@/routes/index';
import authorController from '@/controllers/author'
import App from './app';

const app = new App(new mainRouter(), Number(process.env.PORT));

app.listen();

const testCreateAuthor = async () => {
    const author = {
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1990-01-01'),
        photo: 'https://example.com/photo.jpg',
    };
    try {
        const createdAuthor = await authorController.createAuthor(author)
        console.log('Author created:', createdAuthor);
    } catch (err) {
        console.error('Error creating author:', err);
    }
};
testCreateAuthor(); 