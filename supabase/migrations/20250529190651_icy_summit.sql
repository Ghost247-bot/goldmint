-- Create admin user with secure password if they don't exist
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'rogerbeaudry@yahoo.com' LIMIT 1;
  
  -- Only create user if they don't exist
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'rogerbeaudry@yahoo.com',
      crypt('Lord471@1761', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Create profile for admin user
    INSERT INTO public.profiles (id, name, email)
    VALUES (admin_user_id, 'Admin User', 'rogerbeaudry@yahoo.com');

    -- Create security settings for admin user
    INSERT INTO public.security_settings (user_id, two_factor_enabled)
    VALUES (admin_user_id, false);
  END IF;
END $$;