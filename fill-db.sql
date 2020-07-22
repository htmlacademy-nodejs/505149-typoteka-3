INSERT INTO users VALUES
(1, 'Иван', 'Иванов', 'asterix@gmail.com', 'qwertyasd', 'image.jpg'),
(2, 'Сергей', 'Сидоров', 'obelisk@gmail.com', 'qwertyasd', 'image2.jpg');

INSERT INTO categories VALUES
(1, 'Деревья', 'picture.png'),
(2, 'За жизнь', 'picture.png'),
(3, 'Без рамки', 'picture.png'),
(4, 'Разное', 'picture.png'),
(5, 'IT', 'picture.png'),
(6, 'Музыка', 'picture.png'),
(7, 'Кино', 'picture.png'),
(8, 'Программирование', 'picture.png'),
(9, 'Железо', 'picture.png');

INSERT INTO articles VALUES
(1, 'Рок — это протест', 'Как начать действовать? Для начала просто соберитесь.', 'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения.', '', '11.06.2020', 1),
(2, 'Как собрать камни бесконечности', 'Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.', 'Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов.', '', '24.04.2020', 1),
(3, 'Учим HTML и CSS', 'Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина.', 'Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.', '', '28.04.2020', 1);

INSERT INTO comments VALUES
(1, 'Это где ж такие красоты?', '24.06.2020', 1, 1),
(2, 'Совсем немного...', '21.06.2020', 2, 1),
(3, 'Согласен с автором!', '21.05.2020', 2, 1),
(4, 'Мне кажется или я уже читал это где-то?', '19.07.2020', 1, 2),
(5, 'Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', '19.05.2020', 1, 3),
(6, 'Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', '01.05.2020', 2, 3),
(7, 'Хочу такую же футболку :-)', '10.06.2020', 1, 1),
(8, 'Плюсую, но слишком много букав!', '24.06.2020', 2, 3),
(9, 'Планируете записать видосик на эту тему?', '12.07.2020', 1, 3),
(10, 'Даже не знаю что сказать.', '08.07.2020', 1, 1);

INSERT INTO articles_categories VALUES
(2, 1),
(2, 2),
(2, 3),
(3, 3),
(1, 4),
(2, 4),
(3, 5),
(1, 6),
(3, 6),
(3, 7),
(1, 8),
(3, 9),
(1, 9);
