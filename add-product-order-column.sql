-- Run this command in the Supabase SQL Editor to add the product_order column
-- This allows you to manually control the listing order of your products

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_order INTEGER DEFAULT 0;

-- Optional: If you want to see the current state
-- SELECT name, product_order FROM products ORDER BY product_order ASC;
