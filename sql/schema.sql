-- ============================================================
-- Laboratory Equipment Inventory System
-- Database: Supabase (PostgreSQL)
-- Table: equipment
-- ============================================================
-- How to use:
-- 1. Open your Supabase project -> SQL Editor -> New query
-- 2. Paste this whole file and click "Run"
-- ============================================================

-- Drop the table first if you need to re-run this script from scratch
drop table if exists public.equipment;

create table public.equipment (
    equipment_id    varchar(20)  primary key,
    equipment_name  varchar(100) not null,
    category        varchar(50)  not null,
    quantity        integer      not null check (quantity >= 0),
    condition       varchar(20)  not null
                     check (condition in ('Good', 'For Repair', 'Damaged', 'Unserviceable')),
    laboratory      varchar(100) not null,
    date_acquired   date         not null,
    created_at      timestamptz  not null default now()
);

comment on table  public.equipment            is 'Laboratory Equipment Inventory - Equipment Management Module';
comment on column public.equipment.equipment_id   is 'Unique identification of equipment (e.g. EQ-0001)';
comment on column public.equipment.equipment_name is 'Name of the equipment';
comment on column public.equipment.category        is 'Equipment classification, e.g. Computer, Networking, Furniture';
comment on column public.equipment.quantity         is 'Number of available units';
comment on column public.equipment.condition        is 'Good | For Repair | Damaged | Unserviceable';
comment on column public.equipment.laboratory       is 'Location of the equipment';
comment on column public.equipment.date_acquired    is 'Date the equipment was acquired';

-- ------------------------------------------------------------
-- Row Level Security
-- For a 3-hour class prototype we keep this simple and open so
-- the front end (anon key) can read/write without a login flow.
-- In a production system you would restrict these policies to
-- authenticated users instead.
-- ------------------------------------------------------------
alter table public.equipment enable row level security;

create policy "Public can read equipment"
    on public.equipment for select
    using (true);

create policy "Public can insert equipment"
    on public.equipment for insert
    with check (true);

create policy "Public can update equipment"
    on public.equipment for update
    using (true);

create policy "Public can delete equipment"
    on public.equipment for delete
    using (true);

-- ------------------------------------------------------------
-- Sample data (at least 5 records, per lab requirement)
-- ------------------------------------------------------------
insert into public.equipment
    (equipment_id, equipment_name, category, quantity, condition, laboratory, date_acquired)
values
    ('EQ-0001', 'Dell OptiPlex Desktop PC', 'Computer',   15, 'Good',         'Computer Lab 1', '2023-06-12'),
    ('EQ-0002', '24-Port Network Switch',   'Networking',  4, 'Good',         'Networking Lab',  '2022-11-03'),
    ('EQ-0003', 'Digital Multimeter',       'Electronics', 20, 'For Repair',  'Electronics Lab',  '2021-08-20'),
    ('EQ-0004', 'LCD Projector',            'AV Equipment', 3, 'Damaged',     'Computer Lab 2',   '2020-02-14'),
    ('EQ-0005', 'Ergonomic Lab Chair',      'Furniture',   30, 'Good',        'Computer Lab 1',   '2023-01-09'),
    ('EQ-0006', 'Soldering Station',        'Electronics',  8, 'Unserviceable','Electronics Lab',  '2019-09-30'),
    ('EQ-0007', 'Wireless Access Point',    'Networking',   6, 'Good',        'Networking Lab',   '2024-03-18');
