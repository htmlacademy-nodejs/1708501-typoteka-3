"use strict";

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const lastCommentsList = document.querySelector('.last__list');
  const hotArticlesList = document.querySelector('.hot__list');

  const trimText = (text, trimmingLength = 100) => text.length > trimmingLength ? `${text.substring(0, trimmingLength)}...` : text;

  const renderArticleElement = (article) => (
    `
      <li class="hot__list-item">
        <a class="hot__list-link" href="/articles/${article.id}">
          ${trimText(article.announce)}
          <sup>${article.commentsCount}</sup>
        </a>
      </li>
    `
  );
  const renderCommentElement = (comment) => (
    `
      <li class="last__list-item">
        <img
          class="last__list-image"
          src="${comment.user.avatar}"
          width="20" height="20" alt="Аватар пользователя"
        />
        <b class="last__list-name">
          ${comment.user.firstName} ${comment.user.lastName}
        </b>
        <a class="last__list-link" href="/articles/${comment.articleId}">
          ${trimText(comment.text)}
        </a>
      </li>
    `
  );

  socket.addEventListener("comment:create", (articles, comments) => {
    const commentsHTMLText = comments.map(renderCommentElement).join('');
    lastCommentsList.innerHTML = commentsHTMLText;

    const articlesHTMLText = articles.map(renderArticleElement).join('');
    hotArticlesList.innerHTML = articlesHTMLText;
  });
})();
