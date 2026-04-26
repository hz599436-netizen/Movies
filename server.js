const http = require('http');
const movies = require('./data/movies.json');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

  
    if (req.url === '/api/movies' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(movies));
    }

    
    else if (req.url.startsWith('/api/movies/') && req.method === 'GET') {
        const movieId = req.url.split('/')[3];
        const movie = movies.find(m => m.id === parseInt(movieId));

        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(movie));
        } else {
            res.writeHead(404);
            return res.end('Movie Not Found');
        }
    }

   
    else if (req.url === '/api/movies' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const newMovie = JSON.parse(body);
            const addedMovie = await addAMovie(newMovie);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(addedMovie));
        });
    }

    
    else if (req.url === '/api/movies' && req.method === 'PUT') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const updatedMovie = JSON.parse(body);
            const result = await updateMovie(updatedMovie);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    else if (req.url.startsWith('/api/movies/') && req.method === 'DELETE') {
        const movieId = req.url.split('/')[3];

        deleteMovie(parseInt(movieId)).then(result => {
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404);
                res.end('Movie Not Found');
            }
        });
    }

    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const addAMovie = async (movie) => {
    const filePath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const movies = JSON.parse(data);

    movie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;
    movies.push(movie);

    await fs.promises.writeFile(filePath, JSON.stringify(movies, null, 2));
    return movie;
};

const updateMovie = async (movie) => {
    const filePath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const movies = JSON.parse(data);

    const index = movies.findIndex(m => m.id === movie.id);
    if (index !== -1) {
        movies[index] = movie;
        await fs.promises.writeFile(filePath, JSON.stringify(movies, null, 2));
    }

    return movie;
};
const deleteMovie = async (id) => {
    const filePath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    let movies = JSON.parse(data);

    const movie = movies.find(m => m.id === id);
    if (!movie) return null;

    movies = movies.filter(m => m.id !== id);
    await fs.promises.writeFile(filePath, JSON.stringify(movies, null, 2));

    return movie;
};


server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/api/movies');
});
