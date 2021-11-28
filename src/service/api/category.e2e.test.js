"use strict";

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `r03Gry`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-09-12T07:57:43.774Z`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    category: [`Кино`, `Программирование`, `Без рамки`, `IT`, `Деревья`],
    comments: [
      {
        id: `Lu0tB7`,
        text: `Планируете записать видосик на эту тему? Совсем немного... Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `P0ePnQ`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты?`,
      },
      {
        id: `dl6Eg7`,
        text: `Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    id: `X1hfn_`,
    title: `Ёлки. История деревьев`,
    createdAt: `2021-08-09T03:56:17.025Z`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь.`,
    fullText: `Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    category: [`За жизнь`, `Деревья`, `Железо`, `Музыка`],
    comments: [
      {
        id: `i-vitL`,
        text: `Это где ж такие красоты?`,
      },
      {
        id: `QRcwO-`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`,
      },
      {
        id: `vKBzOx`,
        text: `Согласен с автором!`,
      },
    ],
  },
  {
    id: `g3kIQ2`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-09-17T01:57:58.443Z`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Простые ежедневные упражнения помогут достичь успеха.`,
    category: [`Без рамки`, `IT`, `За жизнь`, `Железо`, `Разное`],
    comments: [
      {
        id: `Tmze5u`,
        text: `Планируете записать видосик на эту тему? Совсем немного...`,
      },
      {
        id: `Zic5RO`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        id: `IvAfit`,
        text: `Совсем немного... Согласен с автором!`,
      },
    ],
  },
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () =>
    expect(response.body.length).toBe(9));

  test(`Category names are "Кино", "Программирование", "Без рамки", "IT", "Деревья", "За жизнь", "Железо", "Музыка","Разное"`, () =>
    expect(response.body).toEqual(
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
