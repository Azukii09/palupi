# justfile untuk Palupi Project (Development)
# ===========================================

# Pakai .env.dev untuk konfigurasi
set dotenv-load := true
set shell := ["bash", "-uc"]

compose := "docker compose -f docker-compose.dev.yml --env-file .env.dev"

# Jalankan service dalam mode dev
up:
    {{compose}} up

# Jalankan dengan rebuild image
up-build:
    {{compose}} up --build

# Stop service
down:
    {{compose}} down

# Stop service + hapus volume (reset DB, cargo cache, dll.)
down-v:
    {{compose}} down -v

# Lihat log service (follow mode)
logs:
    {{compose}} logs -f

# Lihat status container
ps:
    {{compose}} ps

# Masuk ke container API (Rust)
sh-api:
    {{compose}} exec api bash

# Masuk ke container Web (Next.js)
sh-web:
    {{compose}} exec web sh

# Masuk ke container Database (Postgres)
sh-db:
    {{compose}} exec db psql -U {{env_var("POSTGRES_USER")}} -d {{env_var("POSTGRES_DB")}}



# just up         # docker compose up
# just up-build   # docker compose up --build
# just down       # docker compose down
# just down-v     # docker compose down -v
# just logs       # logs semua service
# just ps         # status container
# just sh-api     # masuk ke container API
# just sh-web     # masuk ke container Web
# just sh-db      # masuk ke Postgres
