"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../constants`);

const mockCategories = [
  `Кино`,
  `Программирование`,
  `Без рамки`,
  `IT`,
  `Деревья`,
  `За жизнь`,
  `Железо`,
  `Музыка`,
  `Разное`,
];

const mockData = [
  {
    user: `ivanov@example.com`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-08-09T03:56:17.025Z`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    categories: [`Кино`, `Программирование`, `Без рамки`, `IT`, `Деревья`],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Планируете записать видосик на эту тему? Совсем немного... Мне кажется или я уже читал это где-то?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
    title: `Ёлки. История деревьев`,
    createdAt: `2021-08-09T03:56:17.025Z`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь.`,
    fullText: `Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    categories: [`За жизнь`, `Деревья`, `Железо`, `Музыка`],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Это где ж такие красоты?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-08-09T03:56:17.025Z`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха.`,
    categories: [`Без рамки`, `IT`, `За жизнь`, `Железо`, `Разное`],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Планируете записать видосик на эту тему? Совсем немного...`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Совсем немного... Согласен с автором!`,
      },
    ],
  },
];

const createAPI = async () => {
  const users = [
    {
      firstName: `Иван`,
      lastName: `Иванов`,
      email: `ivanov@example.com`,
      passwordHash: await passwordUtils.hash(`ivanov`),
      avatar: `avatar-1.png`,
    },
    {
      firstName: `Пётр`,
      lastName: `Петров`,
      email: `petrov@example.com`,
      passwordHash: await passwordUtils.hash(`petrov`),
      avatar: `avatar-2.png`,
    },
  ];

  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockData,
    users,
  });

  const app = express();
  app.use(express.json());

  category(app, new DataService(mockDB));
  return app;
};

describe(`API returns category list`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 9 categories`, () =>
    expect(response.body.length).toBe(9));

  test(`Category names are "Кино", "Программирование", "Без рамки", "IT", "Деревья", "За жизнь", "Железо", "Музыка","Разное"`, () =>
    expect(response.body.map((cat) => cat.name)).toEqual(
        expect.arrayContaining([
          `Кино`,
          `Программирование`,
          `Без рамки`,
          `IT`,
          `Деревья`,
          `За жизнь`,
          `Железо`,
          `Музыка`,
          `Разное`,
        ])
    ));
});

describe(`API creates an category if data is valid`, () => {
  const newCategory = {
    name: `Новая категория`,
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns category created`, () =>
    expect(response.body.name).toEqual(newCategory.name));
  test(`Category count is changed`, () =>
    request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(10)));
});

test(`API refuses to create a category if data is invalid`, async () => {
  const app = await createAPI();
  await request(app)
    .post(`/categories`)
    .send({name: `123`} /* too short */)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API changes existent category`, () => {
  const newCategory = {
    name: `Новое название`,
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/categories/2`).send(newCategory);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns category created`, () => expect(response.body).toBeTruthy());
});

test(`API refuses to delete a category with not number ID`, async () => {
  const app = await createAPI();
  await request(app).delete(`/categories/NOEXST`).expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete a non-existent category 404`, async () => {
  const app = await createAPI();
  await request(app).delete(`/categories/9999`).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  await request(app)
    .put(`/categories/9999`)
    .send({name: `Новое название`})
    .expect(HttpCode.NOT_FOUND);
});
