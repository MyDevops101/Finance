CREATE TYPE trade_side AS ENUM ('BUY', 'SELL');
CREATE TYPE alert_kind AS ENUM ('PRICE', 'SENTIMENT', 'INSIDER', 'CONGRESS', 'MACRO', 'RISK');
CREATE TYPE strategy_kind AS ENUM ('MOVING_AVERAGE', 'RSI', 'MACD', 'MOMENTUM', 'FACTOR');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

CREATE TABLE portfolios (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE holdings (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  sector TEXT,
  shares NUMERIC(20, 6) NOT NULL,
  average_cost NUMERIC(20, 6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, symbol)
);

CREATE TABLE watchlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE watchlist_items (
  id TEXT PRIMARY KEY,
  watchlist_id TEXT NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(watchlist_id, symbol)
);

CREATE TABLE saved_screens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE research_runs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strategy strategy_kind NOT NULL,
  universe TEXT NOT NULL,
  parameters JSONB NOT NULL,
  metrics JSONB NOT NULL,
  equity_curve JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trade_disclosures (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  filer_name TEXT NOT NULL,
  filer_role TEXT,
  symbol TEXT NOT NULL,
  company TEXT,
  side trade_side NOT NULL,
  shares NUMERIC(20, 6),
  value_usd NUMERIC(20, 2),
  disclosed_at TIMESTAMPTZ NOT NULL,
  filing_url TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind alert_kind NOT NULL,
  symbol TEXT,
  threshold NUMERIC(20, 6),
  enabled BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE api_cache (
  key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  payload JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX portfolios_user_id_idx ON portfolios(user_id);
CREATE INDEX holdings_symbol_idx ON holdings(symbol);
CREATE INDEX watchlists_user_id_idx ON watchlists(user_id);
CREATE INDEX saved_screens_user_id_idx ON saved_screens(user_id);
CREATE INDEX research_runs_user_strategy_idx ON research_runs(user_id, strategy);
CREATE INDEX trade_disclosures_source_disclosed_idx ON trade_disclosures(source, disclosed_at);
CREATE INDEX trade_disclosures_symbol_idx ON trade_disclosures(symbol);
CREATE INDEX alerts_user_enabled_idx ON alerts(user_id, enabled);
CREATE INDEX alerts_symbol_idx ON alerts(symbol);
CREATE INDEX api_cache_provider_expires_idx ON api_cache(provider, expires_at);
