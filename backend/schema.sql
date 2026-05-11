-- Stroke Prediction System — DDL
-- ─────────────────────────────────────────────────────────────────────────────
-- Kullanım (psql):
--   psql -U postgres -c "CREATE DATABASE stroke_db;"
--   psql -U postgres -d stroke_db -f schema.sql
--
-- Veritabanı Python tarafından da otomatik oluşturulur (database.py).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id               SERIAL PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    full_name        VARCHAR(255) NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,
    created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
CREATE INDEX IF NOT EXISTS ix_users_id    ON users (id);

-- ── Predictions ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    input_data  JSONB   NOT NULL,
    result_data JSONB   NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_predictions_id      ON predictions (id);
CREATE INDEX IF NOT EXISTS ix_predictions_user_id ON predictions (user_id);
