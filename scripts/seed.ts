import 'dotenv/config';
import { registerUser } from '../src/services/auth/register.js';
import { returnUserByUsername } from '../src/repositories/auth/users.js';
import { getRecipesByUserId } from '../src/repositories/recipes/recipes.js';
import { addRecipe } from '../src/services/recipes/addRecipe.js';

const SEED_PASSWORD = 'Password123!';

const users = [
  { username: 'chef_maria', id: undefined as number | undefined },
  { username: 'home_cook_alex', id: undefined as number | undefined },
  { username: 'baker_sam', id: undefined as number | undefined },
];

const recipesByUser: Record<string, Array<{
  title: string;
  ingredients: string[];
  steps: string;
  prepTime: string;
  photoUrl?: string;
}>> = {
  chef_maria: [
    {
      title: 'Spaghetti Carbonara',
      ingredients: ['spaghetti', 'eggs', 'pancetta', 'parmesan', 'black pepper'],
      steps: 'Boil spaghetti. Fry pancetta until crisp. Whisk eggs with parmesan. Toss hot pasta with pancetta, then off heat mix in egg mixture until creamy. Season with black pepper.',
      prepTime: '25 minutes',
      photoUrl: 'https://picsum.photos/seed/carbonara/800/600',
    },
    {
      title: 'Chicken Tikka Masala',
      ingredients: ['chicken thighs', 'yogurt', 'garam masala', 'tomato sauce', 'cream', 'garlic', 'ginger'],
      steps: 'Marinate chicken in yogurt and spices. Grill until charred. Simmer tomato sauce with garlic, ginger and garam masala, stir in cream, then add chicken and simmer 10 minutes.',
      prepTime: '45 minutes',
      photoUrl: 'https://picsum.photos/seed/tikkamasala/800/600',
    },
    {
      title: 'Greek Salad',
      ingredients: ['cucumber', 'tomato', 'red onion', 'feta cheese', 'kalamata olives', 'olive oil', 'oregano'],
      steps: 'Chop cucumber, tomato and red onion. Combine with olives and feta. Drizzle with olive oil, sprinkle oregano, and toss gently.',
      prepTime: '10 minutes',
    },
    {
      title: 'Margherita Pizza',
      ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'fresh basil', 'olive oil'],
      steps: 'Stretch dough into a round. Spread tomato sauce, top with torn mozzarella. Bake at 250C until crust is golden. Finish with fresh basil and a drizzle of olive oil.',
      prepTime: '30 minutes',
      photoUrl: 'https://picsum.photos/seed/margheritapizza/800/600',
    },
    {
      title: 'Beef Bourguignon',
      ingredients: ['beef chuck', 'red wine', 'carrots', 'pearl onions', 'mushrooms', 'bacon', 'garlic', 'thyme'],
      steps: 'Sear beef and bacon. Sauté carrots, onions and garlic. Deglaze with red wine, add beef back with thyme, and braise low and slow until fork-tender. Stir in mushrooms near the end.',
      prepTime: '3 hours',
      photoUrl: 'https://picsum.photos/seed/beefbourguignon/800/600',
    },
    {
      title: 'Caesar Salad',
      ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'caesar dressing', 'anchovy fillets'],
      steps: 'Chop romaine and toss with caesar dressing. Top with shaved parmesan, croutons and anchovy fillets.',
      prepTime: '15 minutes',
    },
    {
      title: 'Mushroom Risotto',
      ingredients: ['arborio rice', 'mushrooms', 'vegetable stock', 'white wine', 'parmesan', 'onion', 'butter'],
      steps: 'Sauté onion and mushrooms in butter. Add rice and toast briefly. Deglaze with white wine, then add stock a ladle at a time, stirring until creamy. Finish with parmesan and butter.',
      prepTime: '40 minutes',
      photoUrl: 'https://picsum.photos/seed/mushroomrisotto/800/600',
    },
  ],
  home_cook_alex: [
    {
      title: 'Beef Tacos',
      ingredients: ['ground beef', 'taco seasoning', 'corn tortillas', 'lettuce', 'cheddar cheese', 'salsa'],
      steps: 'Brown ground beef and mix in taco seasoning with a splash of water. Warm tortillas. Fill with beef, lettuce, cheese and salsa.',
      prepTime: '20 minutes',
      photoUrl: 'https://picsum.photos/seed/beeftacos/800/600',
    },
    {
      title: 'Vegetable Stir Fry',
      ingredients: ['broccoli', 'bell pepper', 'carrot', 'soy sauce', 'garlic', 'ginger', 'sesame oil'],
      steps: 'Heat sesame oil, add garlic and ginger. Stir fry vegetables until crisp-tender. Add soy sauce and toss to coat.',
      prepTime: '15 minutes',
    },
    {
      title: 'Classic Pancakes',
      ingredients: ['flour', 'milk', 'egg', 'baking powder', 'sugar', 'butter'],
      steps: 'Whisk dry ingredients. Whisk in milk, egg and melted butter until just combined. Cook spoonfuls on a hot buttered griddle until bubbles form, then flip.',
      prepTime: '20 minutes',
      photoUrl: 'https://picsum.photos/seed/pancakes/800/600',
    },
    {
      title: 'Grilled Cheese Sandwich',
      ingredients: ['bread', 'cheddar cheese', 'butter'],
      steps: 'Butter one side of each bread slice. Layer cheese between the unbuttered sides. Grill in a pan over medium heat until golden on both sides and cheese is melted.',
      prepTime: '10 minutes',
    },
    {
      title: 'Chili Con Carne',
      ingredients: ['ground beef', 'kidney beans', 'crushed tomatoes', 'onion', 'chili powder', 'cumin', 'garlic'],
      steps: 'Brown beef with onion and garlic. Stir in chili powder and cumin. Add crushed tomatoes and kidney beans, then simmer 30 minutes until thickened.',
      prepTime: '45 minutes',
      photoUrl: 'https://picsum.photos/seed/chiliconcarne/800/600',
    },
    {
      title: 'Shrimp Scampi',
      ingredients: ['shrimp', 'linguine', 'garlic', 'butter', 'white wine', 'lemon juice', 'parsley'],
      steps: 'Cook linguine. Sauté garlic in butter, add shrimp until pink. Deglaze with white wine and lemon juice. Toss with pasta and parsley.',
      prepTime: '25 minutes',
      photoUrl: 'https://picsum.photos/seed/shrimpscampi/800/600',
    },
    {
      title: 'Baked Salmon',
      ingredients: ['salmon fillet', 'lemon', 'olive oil', 'garlic', 'dill', 'salt', 'pepper'],
      steps: 'Place salmon on a baking tray, drizzle with olive oil and lemon juice, top with garlic and dill. Bake at 200C for 12-15 minutes until flaky.',
      prepTime: '25 minutes',
    },
  ],
  baker_sam: [
    {
      title: 'Chocolate Chip Cookies',
      ingredients: ['flour', 'butter', 'brown sugar', 'white sugar', 'egg', 'chocolate chips', 'baking soda'],
      steps: 'Cream butter and sugars. Beat in egg. Mix in flour and baking soda, then fold in chocolate chips. Bake at 190C for 10-12 minutes.',
      prepTime: '30 minutes',
      photoUrl: 'https://picsum.photos/seed/cookies/800/600',
    },
    {
      title: 'Banana Bread',
      ingredients: ['ripe bananas', 'flour', 'sugar', 'egg', 'butter', 'baking soda', 'vanilla extract'],
      steps: 'Mash bananas. Mix with melted butter, sugar, egg and vanilla. Fold in flour and baking soda. Pour into a loaf pan and bake at 175C for 55-60 minutes.',
      prepTime: '1 hour 10 minutes',
      photoUrl: 'https://picsum.photos/seed/bananabread/800/600',
    },
    {
      title: 'Blueberry Muffins',
      ingredients: ['flour', 'blueberries', 'sugar', 'egg', 'milk', 'butter', 'baking powder'],
      steps: 'Whisk dry ingredients. Mix in melted butter, egg and milk until just combined. Fold in blueberries. Divide into a muffin tin and bake at 190C for 20 minutes.',
      prepTime: '35 minutes',
      photoUrl: 'https://picsum.photos/seed/blueberrymuffins/800/600',
    },
    {
      title: 'Cinnamon Rolls',
      ingredients: ['flour', 'yeast', 'milk', 'butter', 'sugar', 'cinnamon', 'cream cheese icing'],
      steps: 'Make an enriched dough and let it rise. Roll out, spread with butter, sugar and cinnamon, then roll up and slice. Prove again, bake at 180C for 20-25 minutes, and top with cream cheese icing.',
      prepTime: '2 hours',
      photoUrl: 'https://picsum.photos/seed/cinnamonrolls/800/600',
    },
    {
      title: 'Apple Pie',
      ingredients: ['pie crust', 'apples', 'sugar', 'cinnamon', 'lemon juice', 'butter'],
      steps: 'Toss sliced apples with sugar, cinnamon and lemon juice. Fill a bottom pie crust, dot with butter, cover with top crust and crimp edges. Bake at 190C for 45-50 minutes.',
      prepTime: '1 hour 15 minutes',
      photoUrl: 'https://picsum.photos/seed/applepie/800/600',
    },
    {
      title: 'Sourdough Bread',
      ingredients: ['sourdough starter', 'flour', 'water', 'salt'],
      steps: 'Mix starter, flour and water, rest, then add salt and knead. Bulk ferment with folds, shape, and cold proof overnight. Bake in a hot Dutch oven at 230C until deeply golden.',
      prepTime: '18 hours',
    },
  ],
};

async function seed() {
  for (const user of users) {
    try {
      await registerUser(user.username, SEED_PASSWORD);
      console.log(`Registered ${user.username}`);
    } catch (err) {
      console.log(`Skipping register for ${user.username} (likely already exists): ${(err as Error).message}`);
    }

    const existingUser = await returnUserByUsername(user.username);
    if (!existingUser) {
      console.error(`  Could not find user ${user.username} after registration, skipping their recipes.`);
      continue;
    }
    const userId = existingUser.id;
    user.id = userId;

    const existingRecipes = (await getRecipesByUserId(userId)) ?? [];
    const existingTitles = new Set(
      existingRecipes.map((r) => (r as { title: string }).title.trim().toLowerCase())
    );

    const recipes = recipesByUser[user.username] ?? [];
    for (const recipe of recipes) {
      if (existingTitles.has(recipe.title.trim().toLowerCase())) {
        console.log(`  Skipping "${recipe.title}" for ${user.username} (already exists)`);
        continue;
      }

      try {
        const created = await addRecipe(userId, recipe);
        console.log(`  Added recipe "${recipe.title}" for ${user.username} (id ${(created as { id: number }).id})`);
        existingTitles.add(recipe.title.trim().toLowerCase());
      } catch (err) {
        console.error(`  Failed to add recipe "${recipe.title}" for ${user.username}:`, (err as Error).message);
      }
    }
  }

  console.log('\nSeeding complete.');
  console.log(`All seed users share the password: ${SEED_PASSWORD}`);
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
