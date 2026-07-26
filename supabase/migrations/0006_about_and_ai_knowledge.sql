-- Makes the About section editable from the admin instead of
-- hardcoded, and adds a free-text field the admin can paste anything
-- into (bio facts gathered elsewhere) for the AI assistant to draw on.

alter table site_settings
  add column about_heading text not null default 'Developer on one side, designer on the other.',
  add column about_timeline jsonb not null default '[
    {"label": "Journey", "title": "Started building things", "body": "Picked up design tools before code — CorelDRAW and Photoshop first, then taught myself to build the interfaces I was designing."},
    {"label": "Education", "title": "Formal + self-taught", "body": "Structured learning paired with a lot of late nights shipping small projects to see what actually held up in production."},
    {"label": "Experience", "title": "Client and personal work", "body": "Worked across frontend, backend automation, and design — usually on small teams where one person has to cover more than one role."},
    {"label": "Mission", "title": "Where design and code meet", "body": "Most interesting problems live at the seam between how something looks and how it''s built. That''s the work I keep coming back to."}
  ]'::jsonb,
  add column ai_knowledge_base text;
