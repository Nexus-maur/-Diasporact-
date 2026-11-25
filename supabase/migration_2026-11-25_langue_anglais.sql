-- Autorise l'anglais comme langue de profil (en plus du français et de l'arabe).
alter table profiles drop constraint if exists profiles_lang_check;
alter table profiles add constraint profiles_lang_check check (lang in ('fr','en','ar'));
