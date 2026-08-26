GRANT USAGE ON SCHEMA public TO service_role;
GRANT INSERT ON TABLE public.users TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;