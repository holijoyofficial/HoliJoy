-- Team decision (16 Nov 2026): hotels are no longer asked for a tax number.
-- Hotel verification = corporate email + authorization document + admin review.
alter table public.hotel_private drop column if exists tax_no;
