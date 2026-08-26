create table if not exists users (
    id serial primary key,
    name text not null,
    email text unique not null
);


create table if not exists recipes(
    id serial primary key,
    title text not null,
    description text,
    user_id integer references users(id)
);