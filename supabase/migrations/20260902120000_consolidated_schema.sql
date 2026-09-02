create table if not exists users (
    id serial primary key,
    username text not null,
    password text not null,
    refresh_token text
);

alter table public.users
    add constraint users_username_key unique (username);

create table if not exists recipes (
    id serial primary key,
    title text not null,
    steps text not null,
    prep_time text not null,
    ingredients text[] not null,
    photo_url text,
    user_id integer not null references public.users(id)
);

grant usage on schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
grant select, insert, update, delete on table public.users to service_role;
grant select, insert, update, delete on table public.recipes to service_role;
