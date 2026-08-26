drop table if exists recipes cascade;
drop table if exists ingredients cascade;

create table if not exists ingredients(
    id serial primary key,
    name text not null,
    quantity text not null
);

create table if not exists recipes(
    id serial primary key,
    title text not null,
    description text,
    user_id integer references users(id),
    photo_url text,
    ingredients text[]
);

