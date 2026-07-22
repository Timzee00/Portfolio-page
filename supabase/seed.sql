-- Sample content — replace via the admin dashboard once it exists (Stage 7).
-- Run after 0001_init.sql: supabase db reset  (local) or paste into SQL editor.

insert into categories (name, slug) values
  ('Frontend', 'frontend'),
  ('Backend', 'backend'),
  ('Python', 'python'),
  ('Design', 'design'),
  ('Tools', 'tools');

insert into skills (name, category, description, years_experience, sort_order) values
  ('React', 'Frontend', 'Building interactive UIs with hooks and modern patterns.', 3, 1),
  ('TypeScript', 'Frontend', 'Typed JavaScript for safer, more maintainable code.', 3, 2),
  ('Next.js', 'Frontend', 'Full-stack React framework — SSR, routing, API routes.', 2, 3),
  ('Node.js', 'Backend', 'Server-side JavaScript runtime for APIs and tooling.', 3, 4),
  ('Python', 'Backend', 'Scripting, automation, and backend services.', 4, 5),
  ('Supabase', 'Backend', 'Postgres, auth, storage, and row-level security.', 1, 6),
  ('UI Design', 'Design', 'Interface design with attention to hierarchy and flow.', 3, 7),
  ('Photoshop', 'Design', 'Photo compositing and raster graphics.', 4, 8),
  ('CorelDRAW', 'Design', 'Vector illustration and print design.', 4, 9),
  ('Git', 'Tools', 'Version control and collaborative workflows.', 4, 10);

insert into projects (
  slug, title, summary, description, category, status, tech_stack,
  github_url, live_url, features, sort_order
) values
  (
    'commerce-dashboard',
    'Commerce Analytics Dashboard',
    'A real-time sales dashboard for a small e-commerce team.',
    'Built to replace a spreadsheet-based reporting process. Pulls order data on a schedule and renders it as filterable charts.',
    'Frontend',
    'published',
    array['Next.js', 'TypeScript', 'Supabase', 'Recharts'],
    'https://github.com/example/commerce-dashboard',
    'https://example.com',
    array['Real-time order feed', 'CSV export', 'Role-based access'],
    1
  ),
  (
    'design-system-kit',
    'Component Design System',
    'A reusable component library used across three client projects.',
    'Started as a single project''s UI kit, then extracted into a versioned package once the second client needed the same patterns.',
    'Design',
    'published',
    array['React', 'Tailwind CSS', 'Storybook'],
    'https://github.com/example/design-system-kit',
    null,
    array['40+ components', 'Dark mode built in', 'Documented in Storybook'],
    2
  ),
  (
    'automation-toolkit',
    'Python Automation Toolkit',
    'Scripts that automate repetitive reporting tasks for a small team.',
    'A grab-bag of Python scripts that grew into a small internal toolkit once other people started asking to use them.',
    'Python',
    'published',
    array['Python', 'Pandas', 'Cron'],
    'https://github.com/example/automation-toolkit',
    null,
    array['Scheduled report generation', 'Email delivery', 'Config-driven, no code changes needed to add a report'],
    3
  );

insert into achievements (label, value, suffix, sort_order) values
  ('Projects completed', 20, '+', 1),
  ('Years learning', 4, '+', 2),
  ('Repositories', 35, '+', 3),
  ('Certificates', 6, '', 4);

insert into testimonials (author_name, author_role, author_company, quote, pinned, sort_order) values
  ('Alex Morgan', 'Product Manager', 'Example Co', 'Reliable, communicative, and the kind of person who flags problems before they become blockers.', true, 1),
  ('Sam Rivera', 'Founder', 'Small Studio', 'Took a vague brief and came back with something better than what we asked for.', false, 2);

insert into blog_posts (
  slug, title, excerpt, content_markdown, tags, status, published_at
) values
  (
    'why-i-pair-design-and-code',
    'Why I never fully separate design from code',
    'Most of my bugs turn out to be design decisions I never actually made.',
    E'# Why I never fully separate design from code\n\nMost of the bugs I fix aren''t really bugs — they''re decisions nobody made on purpose. A spacing value that got copied from another component. A hover state that exists because the button next to it had one.\n\n## Designing in the browser\n\nWhen I sketch a layout in CorelDRAW first, I''m often solving a different problem than the one the browser will hand me — real content lengths, real loading states, real screen widths. So I''ve started treating the first coded version as part of the design process, not a translation step after it.\n\n## What this changes in practice\n\n- Fewer redesigns after "it doesn''t look right in prod"\n- Components that hold up when content changes\n- A shorter gap between "designed" and "shipped"\n\nNone of this is a process anyone should copy exactly — it''s just what happens when one person is doing both jobs.',
    array['design', 'process'],
    'published',
    now() - interval '14 days'
  ),
  (
    'automating-the-boring-reports',
    'Automating the reports nobody wanted to write',
    'A small Python script that started as a favor and became a weekly habit.',
    E'# Automating the reports nobody wanted to write\n\nA teammate asked if I could "just pull the numbers real quick" one Friday. Four Fridays later I wrote a script instead.\n\n## The actual problem\n\nIt wasn''t the pulling that took time — it was the reformatting, the manual cross-checking, and forgetting which sheet was the current one.\n\n## What the script does\n\n1. Pulls the latest export on a schedule\n2. Normalizes it into a consistent shape\n3. Emails a summary, not the raw file\n\nThe part I underestimated: writing it so someone *else* on the team could change the report without touching code. Config over hardcoding, every time.',
    array['python', 'automation'],
    'published',
    now() - interval '5 days'
  );
