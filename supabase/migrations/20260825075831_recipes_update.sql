create table if not exists users (
    id serial primary key,
    name text not null,
    email text unique not null
);


create table if not exists recipes(
    id serial primary key,
    title text not null,
    description text,
    user_id integer references users(id),
    photo_url text,
    ingredients text[] references ingredients(name)
);

create table if not exists ingredients(
    id serial primary key,
    name text not null,
    quantity text not null,
    recipe_id integer references recipes(id)
);