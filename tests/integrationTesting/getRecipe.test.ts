import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

const testUsername = `test_get_recipe_${Date.now()}`;
const testPassword = 'TestPass123!';

let accessToken: string;
let recipeId: number;

beforeAll(async () => {
  await request(app)
    .post('/auth/register')
    .send({ username: testUsername, password: testPassword });

  const loginRes = await request(app)
    .post('/auth/login')
    .send({ username: testUsername, password: testPassword });

  accessToken = loginRes.body.accessToken;

  const createRes = await request(app)
    .post('/recipes')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Integration Test Recipe',
      ingredients: ['flour', 'water'],
      steps: 'Mix and bake.',
      prepTime: '10 minutes',
    });

  recipeId = createRes.body.recipe.id;
});

describe('GET /recipes/:id', () => {
  it('returns 401 when no access token is provided', async () => {
    const res = await request(app).get(`/recipes/${recipeId}`);

    expect(res.status).toBe(401);
  });

  it('returns 404 when the recipe does not exist', async () => {
    const res = await request(app)
      .get('/recipes/999999999')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });

  it('returns the recipe when authenticated and the id exists', async () => {
    const res = await request(app)
      .get(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.recipe).toMatchObject({
      id: recipeId,
      title: 'Integration Test Recipe',
      steps: 'Mix and bake.',
      ingredients: ['flour', 'water'],
      prep_time: '10 minutes',
    });
  });
});
