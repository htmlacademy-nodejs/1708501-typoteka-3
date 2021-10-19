"use strict";

const {getRandomInt} = require(`../../utils`);


module.exports.getRandomPicture = () => {
  const mockPictureNames = [`forest`, `sea`, `skyscraper`];
  return `${mockPictureNames[getRandomInt(0, 2)]}.jpg`;
};

module.exports.getRandomDate = (start, end) => {
  return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
