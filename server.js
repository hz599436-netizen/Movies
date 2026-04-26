const http = require('http');
const movies = require('./data/movies.json');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if(req.url === '/api/movies' && req.method === 'GET') {
        
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
    } else if (req.url.startsWith('/api/movies/') && req.method === 'GET') {
        const movieId = req.url.split('/')[3]
        const movie = movies.find(b => b.id === parseInt(movieId));
        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Movie Not Found');
        }
    }  else {
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.end('Not Found');
    }
});

const addAMovie = async (movie) => {
    const moviesDataPath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(moviesDataPath, 'utf-8');
    const movies = JSON.parse(data);
    const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
    movie.id = newId;
    movies.push(movie);
    await fs.promises.writeFile(moviesDataPath, JSON.stringify(movies, null, 2));

    return movie;
}

const updateMovie = async (movie) => {
    const moviesDataPath = path.join(__dirname, 'data', 'movies.json');
    const data = await fs.promises.readFile(moviesDataPath, 'utf-8');
    const movies = JSON.parse(data);
    const index = movies.findIndex(m => m.id === movie.id);
    if (index !== -1) {
        movies[index] = movie;
        await fs.promises.writeFile(moviesDataPath, JSON.stringify(movies, null, 2));
    }
    return movie;

}

server.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000/api/movies`);

});