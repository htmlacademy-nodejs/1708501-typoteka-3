"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
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
    title: `111Как перестать беспокоиться и начать жить`,
    createdAt: `2021-09-11T17:27:00.915Z`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    categories: [
      `Железо`,
      `Музыка`,
      `Программирование`,
      `За жизнь`,
      `IT`,
      `Разное`,
      `Деревья`,
    ],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
    title: `Обзор новейшего смартфона!`,
    createdAt: `2021-08-06T11:30:00.195Z`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году.`,
    fullText: `Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов.`,
    categories: [`Без рамки`, `Железо`, `IT`, `Музыка`, `Кино`, `Деревья`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты? Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-09-09T09:59:59.079Z`,
    announce: `Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов.`,
    categories: [
      `Музыка`,
      `IT`,
      `Деревья`,
      `За жизнь`,
      `Программирование`,
      `Без рамки`,
      `Кино`,
    ],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-08-31T10:19:18.298Z`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    categories: [`Программирование`, `За жизнь`, `IT`, `Без рамки`],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Совсем немного... Согласен с автором!`,
      },
      {
        user: `ivanov@example.com`,
        text: `Согласен с автором!`,
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
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users});

  const app = express();
  app.use(express.json());

  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 articles`, () =>
    expect(response.body.length).toBe(4));
  test(`First article title equals "111Как перестать беспокоиться и начать жить"`, () =>
    expect(response.body[0].title).toBe(
        `111Как перестать беспокоиться и начать жить`
    ));
});

describe(`API returns an article with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article title is "Обзор новейшего смартфона!"`, () =>
    expect(response.body.title).toBe(`Обзор новейшего смартфона!`));
  test(`First comment autor name is "Пётр"`, () =>
    expect(response.body.comments[0].user.firstName).toBe(`Пётр`));


});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    userId: 1,
    title: `Вот заголовок больше 30 символов`,
    announce: `А тут у нас анонс более 30 символов`,
    fullText: `Новый текст`,
    categories: [1, 2, 3],
    picture: `picture.png`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () =>
    expect(response.body.title).toEqual(newArticle.title));
  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    userId: 1,
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: [4, 5, 6],
    picture: `asd.bmp`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    userId: 1,
    title: `Вот новый заголовок больше 30 символов`,
    announce: `А тут у нас новый анонс более 30 символов`,
    fullText: `Новый текст`,
    categories: [1, 2, 4],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/3`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article changed`, () =>
    expect(response.body).toEqual(true));
  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/3`)
      .expect((res) => expect(res.body.title).toBe(newArticle.title)));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  const newArticle = {
    userId: 1,
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    categories: [2, 3, 4]
  };

  await request(app)
    .put(`/articles/987345987345987`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change not number article`, async () => {
  const app = await createAPI();
  const newArticle = {
    userId: 1,
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    categories: [2, 3, 4]
  };

  await request(app)
    .put(`/articles/not_number`)
    .send(newArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    user: null,
    title: `Нет анонса`,
    fullText: `Новый текст`,
    categories: [],
    picture: `asd.bmp`
  };

  await request(app)
    .put(`/articles/2`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article deleted`, () => expect(response.body).toBe(true));
  test(`Article count is 3 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/articles/123123`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete article with not number ID`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API returns a list of comments to given article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () =>
    expect(response.body.length).toBe(2));
  test(`First comment id is "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`, () =>
    expect(response.body[0].text).toBe(`Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    userId: 1,
    text: `Валидный коммент содержит больше 20 символов`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/2/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comment created`, () =>
    expect(response.body.text).toEqual(newComment.text));
  test(`Comments count is changed 2->3`, async () =>
    await request(app)
      .get(`/articles/2/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    user: null,
    text: `Меньше 20 символов`,
  };

  const app = await createAPI();
  await request(app)
    .post(`/articles/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  await request(app)
    .post(`/articles/12312312/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to article with not number ID and returns status code 400`, async () => {
  const app = await createAPI();

  await request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/2/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Commentdeleted`, () =>
    expect(response.body).toBe(true));

  test(`Comments count decreased to 2`, async () =>
    await request(app)
      .get(`/articles/2/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/articles/2/comments/8671627`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete comment with not number ID`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/articles/2/comments/NOEXST`)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();
  await request(app)
    .delete(`/articles/12312312/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to article with not number ID`, async () => {
  const app = await createAPI();
  await request(app)
    .delete(`/articles/NOEXST/comments/1`)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API returns a list of last N comments`, () => {
  let app;
  let response;
  const LIMIT = 7;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/comments?limit=${LIMIT}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 7 articles`, () =>
    expect(response.body.length).toBe(LIMIT));
});
