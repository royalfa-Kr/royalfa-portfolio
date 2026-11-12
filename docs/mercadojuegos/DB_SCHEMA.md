# DB Schema - MercadoJuegos

## Objetivo
Definir un esquema inicial para el MVP usando Supabase/Postgres.

## Tablas previstas
- bg_profiles
- bg_listings
- bg_wishlist_items
- bg_conversations
- bg_messages
- bg_reports

## Enums sugeridos
### operation_type
- sale
- trade
- sale_or_trade

### condition
- new
- like_new
- good
- used_with_details
- incomplete

### availability_status
- available
- negotiating
- reserved
- sold
- traded
- paused

## Notas
- En Sprint 0 no se implementa aún el esquema SQL final.
- Este documento sirve como base para Sprint 1 / Sprint 2.