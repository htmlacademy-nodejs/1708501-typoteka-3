"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `BwpVPu`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-09-11T17:27:00.915Z`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    category: [
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
        id: `kBYrms`,
        text: `Это где ж такие красоты?`,
      },
    ],
  },
  {
    id: `H1Onki`,
    title: `Обзор новейшего смартфона`,
    createdAt: `2021-08-06T11:30:00.195Z`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году.`,
    fullText: `Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов.`,
    category: [`Без рамки`, `Железо`, `IT`, `Музыка`, `Кино`, `Деревья`],
    comments: [
      {
        id: `CwCNV2`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `zpEYkW`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты? Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    id: `4BMTXi`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-09-09T09:59:59.079Z`,
    announce: `Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов.`,
    category: [
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
        id: `Q6Yyse`,
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    id: `y18OHn`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-08-31T10:19:18.298Z`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [`Программирование`, `За жизнь`, `IT`, `Без рамки`],
    comments: [
      {
        id: `NDktB8`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`,
      },
      {
        id: `prGQsY`,
        text: `Совсем немного... Согласен с автором!`,
      },
      {
        id: `kPSeO6`,
        text: `Согласен с автором!`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 articles`, () =>
    expect(response.body.length).toBe(4));
  test(`First article id equals "BwpVPu"`, () =>
    expect(response.body[0].id).toBe(`BwpVPu`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/H1Onki`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article title is "Обзор новейшего смартфона"`, () =>
    expect(response.body.title).toBe(`Обзор новейшего смартфона`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: [`Музыка`, `Кино`, `Деревья`]
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: [`Музыка`, `Кино`, `Деревья`]
  };

  const app = createAPI();

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
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: [`Музыка`, `Кино`, `Деревья`]
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/y18OHn`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/y18OHn`)
    .expect((res) => expect(res.body.title).toBe(`Новый заголовок`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = createAPI();
  const newArticle = {
    title: `Новый заголовок`,
    announce: `Новый анонс`,
    fullText: `Новый текст`,
    category: [`Музыка`, `Кино`, `Деревья`]
  };

  await request(app)
    .put(`/articles/NOEXST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Нет анонса`,
    fullText: `Новый текст`,
    category: []
  };

  await request(app)
    .put(`/articles/y18OHn`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/4BMTXi`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`4BMTXi`));
  test(`Article count is 3 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/H1Onki/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () =>
    expect(response.body.length).toBe(2));
  test(`First comment id is "CwCNV2"`, () =>
    expect(response.body[0].id).toBe(`CwCNV2`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидный коммент`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/y18OHn/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed 3->4`, async () =>
    await request(app)
      .get(`/articles/y18OHn/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {};

  const app = createAPI();
  await request(app)
    .post(`/articles/H1Onki/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/4BMTXi/comments/Q6Yyse`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted comment`, () =>
    expect(response.body.id).toBe(`Q6Yyse`));

  test(`Comments count decreased by 0`, async () =>
    await request(app)
      .get(`/articles/4BMTXi/comments`)
      .expect((res) => expect(res.body.length).toBe(0)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/y18OHn/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = createAPI();
  await request(app)
    .delete(`/offers/NOEXST/comments/s5ye45`)
    .expect(HttpCode.NOT_FOUND);
});
