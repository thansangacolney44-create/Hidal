-- Create the 'songs' table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT NOT NULL,
  duration INT NOT NULL,
  url TEXT NOT NULL,
  "coverArt" TEXT NOT NULL
);
