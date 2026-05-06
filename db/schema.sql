create table if not exists risks (
  id text primary key,
  area text not null,
  risk text not null,
  level text not null check (level in ('Critico', 'Alto', 'Medio', 'Bajo')),
  owner text not null,
  due_date date not null,
  status text not null default 'Abierto',
  created_at timestamptz not null default now()
);

create table if not exists inspections (
  id text primary key,
  area text not null,
  type text not null,
  inspection_date date not null,
  owner text not null,
  result text not null,
  created_at timestamptz not null default now()
);

create table if not exists corrective_actions (
  id text primary key,
  task text not null,
  risk_id text references risks(id) on delete set null,
  owner text not null,
  due_date date not null,
  status text not null default 'Pendiente',
  created_at timestamptz not null default now()
);

create table if not exists committee_members (
  id bigserial primary key,
  name text not null,
  role text,
  email text,
  active boolean not null default true
);

create table if not exists committee_meetings (
  id bigserial primary key,
  meeting_date date not null,
  status text not null default 'Programada',
  minutes text,
  file_name text,
  file_type text,
  file_data bytea
);

create table if not exists committee_agenda (
  id bigserial primary key,
  meeting_id bigint not null references committee_meetings(id) on delete cascade,
  item text not null,
  position integer not null default 1
);

create table if not exists documents (
  id bigserial primary key,
  name text not null,
  type text not null,
  file_name text,
  file_type text,
  file_data bytea,
  updated_at date not null default current_date
);

create table if not exists incidents (
  id text primary key,
  title text not null,
  area text not null,
  severity text not null check (severity in ('Baja', 'Media', 'Alta', 'Critica')),
  owner text not null,
  incident_date date not null,
  status text not null default 'Abierta',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('Administrador', 'Usuario')),
  status text not null default 'Activo',
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table documents add column if not exists file_name text;
alter table documents add column if not exists file_type text;
alter table documents add column if not exists file_data bytea;
alter table committee_members add column if not exists email text;
alter table committee_meetings add column if not exists file_name text;
alter table committee_meetings add column if not exists file_type text;
alter table committee_meetings add column if not exists file_data bytea;

insert into risks (id, area, risk, level, owner, due_date, status)
values
  ('R-001', 'Muelles de carga', 'Atropello por carretillas', 'Critico', 'Jefe de turno', '2026-05-10', 'Abierto'),
  ('R-002', 'Picking altura', 'Caida de objetos', 'Alto', 'Coordinador PRL', '2026-05-14', 'En curso'),
  ('R-003', 'Camara frigorifica', 'Exposicion a bajas temperaturas', 'Medio', 'Mantenimiento', '2026-05-22', 'Controlado')
on conflict (id) do nothing;

insert into inspections (id, area, type, inspection_date, owner, result)
values
  ('I-014', 'Zona expediciones', 'Inspeccion mensual', '2026-05-08', 'Tecnico PRL', 'Programada'),
  ('I-013', 'Estanterias', 'Revision estructural', '2026-04-30', 'Mantenimiento', 'Con observaciones'),
  ('I-012', 'Carga de baterias', 'Verificacion normativa', '2026-04-24', 'Coordinador PRL', 'Apta')
on conflict (id) do nothing;

insert into corrective_actions (id, task, risk_id, owner, due_date, status)
values
  ('A-021', 'Instalar espejo convexo en cruce de pasillo 4', 'R-001', 'Mantenimiento', '2026-05-09', 'Pendiente'),
  ('A-020', 'Actualizar procedimiento de bloqueo de muelles', 'R-001', 'Jefe de almacen', '2026-05-12', 'En curso'),
  ('A-019', 'Formacion sobre manipulacion segura en altura', 'R-002', 'RRHH', '2026-05-20', 'Planificada')
on conflict (id) do nothing;

insert into committee_members (name, role)
select *
from (
  values
    ('Responsable PRL', 'Presidencia'),
    ('Jefe de almacen', 'Operaciones'),
    ('Delegado de prevencion', 'Representacion trabajadores'),
    ('Mantenimiento', 'Soporte tecnico'),
    ('RRHH', 'Formacion'),
    ('Representante operaciones', 'Operaciones')
) as seed(name, role)
where not exists (
  select 1 from committee_members existing where existing.name = seed.name
);

insert into committee_meetings (meeting_date, status)
select '2026-05-15', 'Programada'
where not exists (
  select 1 from committee_meetings where meeting_date = '2026-05-15'
);

insert into committee_agenda (meeting_id, item, position)
select m.id, agenda.item, agenda.position
from committee_meetings m
cross join (
  values
    ('Revision de accidentes e incidentes', 1),
    ('Seguimiento de medidas correctoras', 2),
    ('Planificacion de simulacro de evacuacion', 3)
) as agenda(item, position)
where m.meeting_date = '2026-05-15'
  and not exists (
    select 1
    from committee_agenda existing
    where existing.meeting_id = m.id
      and existing.item = agenda.item
  );

insert into documents (name, type, updated_at)
select *
from (
  values
    ('Evaluacion de riesgos del almacen', 'Evaluacion', '2026-05-02'::date),
    ('Plan de emergencia y evacuacion', 'Plan', '2026-04-18'::date),
    ('Procedimiento de carretillas', 'Procedimiento', '2026-04-10'::date)
) as seed(name, type, updated_at)
where not exists (
  select 1 from documents existing where existing.name = seed.name
);

insert into incidents (id, title, area, severity, owner, incident_date, status, description)
values
  ('INC-001', 'Golpe leve en zona de picking', 'Picking', 'Media', 'Jefe de turno', '2026-05-03', 'Abierta', 'Incidente sin baja registrado durante preparacion de pedido')
on conflict (id) do nothing;

insert into app_users (id, name, email, role, status)
values
  ('USR-001', 'Administrador PRL', 'admin@empresa.com', 'Administrador', 'Activo')
on conflict (id) do nothing;

insert into app_settings (key, value)
values ('APP_ACCESS_CODE', 'Seguridad2026!')
on conflict (key) do nothing;
