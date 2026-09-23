INSERT INTO `Lapangan` (`id`, `name`, `description`, `location`, `price`, `picture_url`, `createdAt`, `updatedAt`)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'Badminton Arena', 'Lapangan badminton indoor dengan lantai nyaman dan pencahayaan terang.', 'Jakarta Selatan', 75000, NULL, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('00000000-0000-4000-8000-000000000002', 'Futsal Center', 'Lapangan futsal indoor untuk pertandingan santai maupun kompetitif.', 'Jakarta Selatan', 150000, NULL, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('00000000-0000-4000-8000-000000000003', 'Tenis Meja House', 'Area tenis meja dengan perlengkapan siap digunakan.', 'Jakarta Pusat', 50000, NULL, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('00000000-0000-4000-8000-000000000004', 'Basketball Court', 'Lapangan basket outdoor dengan ring standar dan area parkir.', 'Jakarta Barat', 125000, NULL, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('00000000-0000-4000-8000-000000000005', 'Voli Community Court', 'Lapangan voli untuk latihan dan bermain bersama komunitas.', 'Jakarta Timur', 100000, NULL, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `location` = VALUES(`location`),
  `price` = VALUES(`price`);