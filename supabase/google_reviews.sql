-- =============================================
-- Google Reviews Table for millarX
-- Run this in your Supabase SQL Editor
-- =============================================

-- Create the google_reviews table
CREATE TABLE IF NOT EXISTS google_reviews (
  id SERIAL PRIMARY KEY,
  reviewer_name VARCHAR(255) NOT NULL,
  review_date VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_local_guide BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_google_reviews_visible ON google_reviews(is_visible);
CREATE INDEX IF NOT EXISTS idx_google_reviews_order ON google_reviews(display_order);

-- Enable Row Level Security
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON google_reviews
  FOR SELECT USING (true);

-- Insert all your Google reviews
INSERT INTO google_reviews (reviewer_name, review_date, rating, review_text, is_local_guide, is_visible, display_order) VALUES

-- Featured/Best reviews first
('Stephen McMahon', '20 weeks ago', 5,
 'MillarX were outstanding to deal with. They helped me compare novated lease quotes side by side, broke down all the hidden costs, and ultimately saved me over $9,000. Their advice was clear, objective, and genuinely in my best interest. I''d highly recommend them to anyone who wants to avoid overpaying. An absolute no-brainer!',
 false, true, 1),

('Paul G', '2 weeks ago', 5,
 'Ben was fantastic in helping unpick and understand the leasing process and finance options. Fast service, transparent and honest advice',
 false, true, 2),

('George Elovaris', '9 weeks ago', 5,
 'Ben is fully transparent and has a great online calculator, thank you',
 true, true, 3),

('Glenn Sullivan', '14 weeks ago', 5,
 'Ben/millarX are great to deal with and made my experience of setting up a new Novated lease, a very easy and stress free one. Highly recommend',
 false, true, 4),

('Daniel Lee', '18 weeks ago', 5,
 'Ben has provided great advice and support in the navigating novated leases to a newcomer like myself. Highly recommended.',
 false, true, 5),

('Adam Hillier', '21 weeks ago', 5,
 'Ben has been so very helpful in assisting me navigate the quotes and estimates for a novated lease. Very quick to respond and happy to answer any question I had. I very much recommend Ben at MillarX for all your novated lease enquiries! Thanks again Ben!',
 false, true, 6),

('Matthew Grove', '22 weeks ago', 5,
 'Ben and MillarX were a great help going through my first novated lease. From procuring the vehicle through to setting up and understanding how the management of a novated lease works, he was very clear and open. This form of car ownership saves consumers a great deal of money. I highly recommend a novated lease with MillarX.',
 false, true, 7),

('Andi Lou', '22 weeks ago', 5,
 'Ben is an awesome broker. I''m new to novated leasing and Ben guided me all the way from start to finish. Went through all the options and benefits according to my situation. He made everything really easy and great to deal with. I''d recommend Ben and the business to anyone who is looking for a better option and stress free transaction for personal or your business.',
 false, true, 8),

-- Reviews with no text (5-star only ratings) - hidden by default
('Dinil Jayasekara', '9 weeks ago', 5, '', true, false, 100),
('Jordan Fens', '18 weeks ago', 5, '', false, false, 101),
('Michael Gott', '19 weeks ago', 5, '', false, false, 102);

-- =============================================
-- Useful queries for managing reviews
-- =============================================

-- View all visible reviews in display order
-- SELECT * FROM google_reviews WHERE is_visible = true ORDER BY display_order;

-- Count total reviews and average rating
-- SELECT COUNT(*) as total_reviews, AVG(rating) as avg_rating FROM google_reviews;

-- Update display order for a review
-- UPDATE google_reviews SET display_order = 1 WHERE id = X;

-- Hide a review
-- UPDATE google_reviews SET is_visible = false WHERE id = X;

-- Add a new review
-- INSERT INTO google_reviews (reviewer_name, review_date, rating, review_text, is_local_guide, display_order)
-- VALUES ('New Reviewer', '1 week ago', 5, 'Great service!', false, 0);
