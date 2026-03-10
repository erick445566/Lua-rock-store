-- Seed data for Lua Rock Store

-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Animes', 'animes', 'Produtos de animes e mangás favoritos', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'),
  ('Séries', 'series', 'Produtos de séries de TV e streaming', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400'),
  ('Camisas de Rock', 'camisas-rock', 'Camisetas de bandas de rock lendárias', 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400'),
  ('Decorações', 'decoracoes', 'Itens decorativos temáticos para sua casa', 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400'),
  ('Geek / Nerd', 'geek-nerd', 'Produtos geek e nerd em geral', 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400')
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (name, slug, description, price, original_price, category_id, images, stock, featured, is_new, is_sale) VALUES
  ('Camiseta Naruto Akatsuki', 'camiseta-naruto-akatsuki', 'Camiseta preta com estampa da Akatsuki de Naruto Shippuden. 100% algodão, alta qualidade. Disponível em todos os tamanhos.', 79.90, 99.90, (SELECT id FROM categories WHERE slug = 'animes'), ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'], 50, true, false, true),
  ('Action Figure Goku SSJ', 'action-figure-goku-ssj', 'Action Figure do Goku Super Saiyajin de Dragon Ball Z. 18cm de altura com detalhes incríveis e base inclusa.', 189.90, NULL, (SELECT id FROM categories WHERE slug = 'animes'), ARRAY['https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=500'], 20, true, true, false),
  ('Camiseta Iron Maiden', 'camiseta-iron-maiden', 'Camiseta oficial Iron Maiden - The Number of the Beast. 100% algodão premium, estampa em silk screen.', 89.90, NULL, (SELECT id FROM categories WHERE slug = 'camisas-rock'), ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'], 35, true, false, false),
  ('Luminária Darth Vader 3D', 'luminaria-darth-vader', 'Luminária 3D do capacete do Darth Vader. LED com 7 cores diferentes, controle remoto incluso.', 129.90, 159.90, (SELECT id FROM categories WHERE slug = 'decoracoes'), ARRAY['https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=500'], 15, false, true, true),
  ('Caneca The Office', 'caneca-the-office', 'Caneca de cerâmica Dunder Mifflin de The Office. Capacidade 350ml, pode ir ao microondas.', 49.90, NULL, (SELECT id FROM categories WHERE slug = 'series'), ARRAY['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'], 100, false, false, false),
  ('Funko Pop Batman', 'funko-pop-batman', 'Funko Pop do Batman da DC Comics. Edição especial colecionador com base exclusiva.', 119.90, NULL, (SELECT id FROM categories WHERE slug = 'geek-nerd'), ARRAY['https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500'], 25, true, true, false),
  ('Camiseta Metallica', 'camiseta-metallica', 'Camiseta Metallica Master of Puppets. Estampa em silk screen de alta qualidade, 100% algodão.', 84.90, 99.90, (SELECT id FROM categories WHERE slug = 'camisas-rock'), ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd0?w=500'], 40, false, false, true),
  ('Poster Attack on Titan', 'poster-attack-on-titan', 'Poster A3 de Attack on Titan com os principais personagens. Papel couché 180g, cores vibrantes.', 29.90, NULL, (SELECT id FROM categories WHERE slug = 'animes'), ARRAY['https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500'], 200, false, true, false),
  ('Mousepad Gamer RGB', 'mousepad-gamer-rgb', 'Mousepad gamer grande 80x30cm com iluminação RGB. Superfície speed, base antiderrapante.', 99.90, 129.90, (SELECT id FROM categories WHERE slug = 'geek-nerd'), ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'], 30, true, false, true),
  ('Chaveiro Stranger Things', 'chaveiro-stranger-things', 'Chaveiro metálico Eleven de Stranger Things. Acabamento premium, resistente e durável.', 24.90, NULL, (SELECT id FROM categories WHERE slug = 'series'), ARRAY['https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500'], 80, false, false, false),
  ('Camiseta Pink Floyd', 'camiseta-pink-floyd', 'Camiseta Pink Floyd - The Dark Side of the Moon. Clássico do rock em algodão premium.', 89.90, NULL, (SELECT id FROM categories WHERE slug = 'camisas-rock'), ARRAY['https://images.unsplash.com/photo-1489367874814-f5d040621dd8?w=500'], 45, true, false, false),
  ('Action Figure Demon Slayer', 'action-figure-demon-slayer', 'Action Figure Tanjiro de Demon Slayer. 20cm de altura, articulado, com acessórios.', 229.90, 279.90, (SELECT id FROM categories WHERE slug = 'animes'), ARRAY['https://images.unsplash.com/photo-1611457194403-d3f8c6e5540f?w=500'], 15, true, true, true)
ON CONFLICT (slug) DO NOTHING;
