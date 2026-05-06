DELETE FROM public.user_roles WHERE user_id IN ('49176d52-e92d-40f4-a3ae-4f328c5f309b','13b4be7c-7650-4cc6-af8f-23af7c58723e');
DELETE FROM public.profiles WHERE user_id IN ('49176d52-e92d-40f4-a3ae-4f328c5f309b','13b4be7c-7650-4cc6-af8f-23af7c58723e');
DELETE FROM auth.users WHERE id IN ('49176d52-e92d-40f4-a3ae-4f328c5f309b','13b4be7c-7650-4cc6-af8f-23af7c58723e');