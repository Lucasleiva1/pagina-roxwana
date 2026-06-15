alter table public.product_images
add column if not exists path text,
add column if not exists bucket text not null default 'product-images',
add column if not exists file_type text,
add column if not exists size integer,
add column if not exists image_role text,
add column if not exists view_number text,
add column if not exists color_code text,
add column if not exists device_variant text,
add column if not exists original_filename text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'product_images_image_role_check'
  ) then
    alter table public.product_images
    add constraint product_images_image_role_check
    check (image_role is null or image_role in ('cover', 'hover', 'gallery', 'detail', 'lifestyle', 'technical'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'product_images_device_variant_check'
  ) then
    alter table public.product_images
    add constraint product_images_device_variant_check
    check (device_variant is null or device_variant in ('desktop', 'mobile', 'base'));
  end if;
end $$;

update public.product_images
set original_filename = regexp_replace(coalesce(path, url), '^.*/', '')
where original_filename is null;

with parsed as (
  select
    id,
    lower(coalesce(original_filename, regexp_replace(coalesce(path, url), '^.*/', ''))) as file_name,
    regexp_match(lower(coalesce(original_filename, regexp_replace(coalesce(path, url), '^.*/', ''))), '(^|[-_])([0-9]{1,2})([-_.]|$)') as number_match
  from public.product_images
)
update public.product_images i
set
  view_number = coalesce(i.view_number, lpad((parsed.number_match)[2], 2, '0')),
  image_role = coalesce(
    i.image_role,
    case
      when i.is_primary = true then 'cover'
      when (parsed.number_match)[2] in ('3', '03') then 'hover'
      when (parsed.number_match)[2] in ('1', '01') then 'cover'
      else 'gallery'
    end
  ),
  device_variant = coalesce(
    i.device_variant,
    case
      when parsed.file_name ~ '(^|[-_])mobile([-_.]|$)' then 'mobile'
      when parsed.file_name ~ '(^|[-_])desktop([-_.]|$)' then 'desktop'
      else 'base'
    end
  ),
  color_code = coalesce(
    i.color_code,
    case
      when parsed.file_name ~ '(^|[-_])neg([-_]|$)' then 'NEG'
      when parsed.file_name ~ '(^|[-_])bla([-_]|$)' then 'BLA'
      when parsed.file_name ~ '(^|[-_])gri([-_]|$)' then 'GRI'
      else null
    end
  )
from parsed
where parsed.id = i.id;

create index if not exists product_images_product_role_idx on public.product_images(product_id, image_role, sort_order);
create index if not exists product_images_product_color_idx on public.product_images(product_id, color_code, sort_order);
