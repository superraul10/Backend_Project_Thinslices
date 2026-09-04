import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

const testUsername = `test_create_recipe_${Date.now()}`;
const testPassword = 'TestPass123!';

let accessToken: string;

beforeAll(async () => {
  await request(app)
    .post('/auth/register')
    .send({ username: testUsername, password: testPassword });

  const loginRes = await request(app)
    .post('/auth/login')
    .send({ username: testUsername, password: testPassword });

  accessToken = loginRes.body.accessToken;
});

describe('POST /recipes', () => {
  it('returns 401 when no access token is provided', async () => {
    const res = await request(app)
      .post('/recipes')
      .send({
        title: 'Unauthenticated Recipe',
        ingredients: ['a'],
        steps: 'do it',
        prepTime: '10 minutes',
      });

    expect(res.status).toBe(401);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Incomplete Recipe' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 when prepTime has the wrong type', async () => {
    const res = await request(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Wrong Type Recipe',
        ingredients: ['a'],
        steps: 'do it',
        prepTime: ['20', 'minutes'],
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('creates the recipe and returns 201 on a valid payload', async () => {
    const res = await request(app)
      .post('/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Create Recipe Test',
        ingredients: ['flour', 'water'],
        steps: 'Mix and bake.',
        prepTime: '10 minutes',
      });

    expect(res.status).toBe(201);
    expect(res.body.recipe).toMatchObject({
      title: 'Create Recipe Test',
    });
    expect(res.body.recipe.id).toEqual(expect.any(Number));

    const getRes = await request(app)
      .get(`/recipes/${res.body.recipe.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.recipe).toMatchObject({
      title: 'Create Recipe Test',
      steps: 'Mix and bake.',
      ingredients: ['flour', 'water'],
      prep_time: '10 minutes',
    });
  });
});
