const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;

  const repository = { id: uuid(), title, url, techs, likes };

  repositories.push(repository);

  return response.status(202).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  // Route Params
  const { id } = request.params;
  // Request Body
  const { title, url, techs } = request.body;

  const repositoryIndex = checkIfTheRepositoryExists(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(202).json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  // Route Params
  const { id } = request.params;

  const repositoryIndex = checkIfTheRepositoryExists(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  // Route Params
  const { id } = request.params;

  const repositoryIndex = checkIfTheRepositoryExists(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositoryIndex].likes++;

  return response.status(202).json(repositories[repositoryIndex]);
});

function checkIfTheRepositoryExists(id) {
  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  return repositoryIndex;
}

module.exports = app;
