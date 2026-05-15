// ПОЛНАЯ РЕАЛИЗАЦИЯ SPA С ВСЕМ ФУНКЦИОНАЛОМ
document.addEventListener('DOMContentLoaded', function() {
  // ---------- SPA РОУТИНГ ----------
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll(".nav-item");

  // Показываем только главную страницу при загрузке
  pages.forEach(page => {
    if (page.classList.contains('page-home')) {
      page.hidden = false;
    } else {
      page.hidden = true;
    }
  });

  // Инициализируем иконки меню при загрузке
  navButtons.forEach(button => {
    if (button.classList.contains('nav-item-active')) {
      updateNavIcon(button, true); // Устанавливаем активную иконку для активного элемента
    } else {
      updateNavIcon(button, false); // Устанавливаем обычную иконку для неактивных элементов
    }
  });

  // Навигация по меню
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.dataset.page;

      // Скрываем все страницы
      pages.forEach(page => {
        page.hidden = true;
      });

      // Показываем целевую страницу
      const targetPageElement = document.querySelector(`.page-${targetPage}`);
      if (targetPageElement) {
        targetPageElement.hidden = false;
      }

      // Обновляем активное состояние кнопок
      navButtons.forEach(btn => {
        btn.classList.remove('nav-item-active');
        updateNavIcon(btn, false); // Сбрасываем иконку на неактивную
      });
      this.classList.add('nav-item-active');
      updateNavIcon(this, true); // Устанавливаем активную иконку

      // Меняем URL
      let path = '/';
      if (targetPage === 'search') path = '/search';
      else if (targetPage === 'notifications') path = '/notifications';
      else if (targetPage === 'account') path = '/account';

      history.pushState({ page: targetPage }, '', path);
    });
  });

  // Функция для обновления иконок меню
  function updateNavIcon(button, isActive) {
    const icon = button.querySelector('.nav-icon');
    if (!icon) return;

    const pageType = button.dataset.page;
    let iconPath = '';

    if (isActive) {
      // Активные иконки (выбранные пункты)
      if (pageType === 'home') iconPath = 'menu-icons/feed2.svg';
      else if (pageType === 'search') iconPath = 'menu-icons/explore2.svg';
      else if (pageType === 'notifications') iconPath = 'menu-icons/notifications2.svg';
      else if (pageType === 'account') iconPath = 'menu-icons/user2.svg';
    } else {
      // Обычные иконки
      if (pageType === 'home') iconPath = 'menu-icons/feed.svg';
      else if (pageType === 'search') iconPath = 'menu-icons/explore.svg';
      else if (pageType === 'notifications') iconPath = 'menu-icons/notifications.svg';
      else if (pageType === 'account') iconPath = 'menu-icons/user.svg';
    }

    icon.src = iconPath;
  }

  // Обработчики hover для меню
  navButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (!this.classList.contains('nav-item-active')) {
        const icon = this.querySelector('.nav-icon');
        if (icon) {
          const pageType = this.dataset.page;
          let hoverIconPath = '';

          // Иконки при наведении
          if (pageType === 'home') hoverIconPath = 'menu-icons/feed1.svg';
          else if (pageType === 'search') hoverIconPath = 'menu-icons/explore1.svg';
          else if (pageType === 'notifications') hoverIconPath = 'menu-icons/notifications1.svg';
          else if (pageType === 'account') hoverIconPath = 'menu-icons/user1.svg';

          icon.src = hoverIconPath;
        }
      }
    });

    button.addEventListener('mouseleave', function() {
      if (!this.classList.contains('nav-item-active')) {
        updateNavIcon(this, false); // Возвращаем обычную иконку
      }
    });
  });

  // Обработчик кнопок назад/вперед
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      const targetPage = e.state.page;
      pages.forEach(page => { page.hidden = true; });
      const targetPageElement = document.querySelector(`.page-${targetPage}`);
      if (targetPageElement) { targetPageElement.hidden = false; }
      navButtons.forEach(btn => {
        btn.classList.remove('nav-item-active');
        updateNavIcon(btn, false); // Сбрасываем иконку на неактивную
        if (btn.dataset.page === targetPage) {
          btn.classList.add('nav-item-active');
          updateNavIcon(btn, true); // Устанавливаем активную иконку
        }
      });
    }
  });

  // ---------- ДАННЫЕ И ФУНКЦИОНАЛ ПОСТОВ ----------
  let posts = [];
  let nextPostId = 1;
  let postTimestamps = [];
  const charLimit = 1000;

  // Утилиты
  function createPostObject(text, imageUrl) {
    return {
      id: nextPostId++,
      username: "Гость",
      handle: "@guest",
      text,
      imageUrl: imageUrl || null,
      likes: 0,
      liked: false,
      createdAt: Date.now()
    };
  }

  function sortPosts() {
    posts.sort((a, b) => {
      if (b.likes !== a.likes) return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });
  }

  // Рендеринг постов
  const postsListEl = document.getElementById("posts-list");

  function renderPosts() {
    if (!postsListEl) return;

    postsListEl.innerHTML = "";
    sortPosts();

    posts.forEach((post) => {
      const li = document.createElement("li");
      li.className = "post";
      li.dataset.id = post.id;

      // Аватар
      const avatar = document.createElement("div");
      avatar.className = "post-avatar";

      // Контент поста
      const content = document.createElement("div");
      content.className = "post-content";

      // Верхняя часть
      const header = document.createElement("div");
      header.className = "post-header";

      const username = document.createElement("span");
      username.className = "post-username";
      username.textContent = post.username;

      const handle = document.createElement("span");
      handle.className = "post-handle";
      handle.textContent = post.handle;

      header.appendChild(username);
      header.appendChild(handle);

      // Текст поста
      const text = document.createElement("div");
      text.className = "post-text";
      text.textContent = post.text;

      content.appendChild(header);
      content.appendChild(text);

      // Фото, если есть
      if (post.imageUrl) {
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "post-image-wrapper";

        const img = document.createElement("img");
        img.className = "post-image";
        img.src = post.imageUrl;
        img.alt = "Изображение поста";

        imageWrapper.appendChild(img);
        content.appendChild(imageWrapper);
      }

      // Нижняя панель
      const footer = document.createElement("div");
      footer.className = "post-footer";

      // Кнопка лайка
      const likeButton = document.createElement("button");
      likeButton.className = "like-button";

      const likeIcon = document.createElement("img");
      likeIcon.className = "like-icon";
      likeIcon.src = post.liked ? "menu-icons/like1.svg" : "menu-icons/like.svg";
      likeIcon.alt = "Лайк";

      const likeCount = document.createElement("span");
      likeCount.className = "like-count";
      likeCount.textContent = post.likes;

      likeButton.appendChild(likeIcon);
      likeButton.appendChild(likeCount);

      likeButton.addEventListener("click", () => {
        post.liked = !post.liked;
        post.likes = post.liked ? post.likes + 1 : Math.max(0, post.likes - 1);
        renderPosts();
      });

      // Кнопка комментариев
      const commentButton = document.createElement("button");
      commentButton.className = "comment-button";
      commentButton.type = "button";

      const commentIcon = document.createElement("img");
      commentIcon.className = "comment-icon";
      commentIcon.src = "menu-icons/comments.svg";
      commentIcon.alt = "Комментарии";

      commentButton.appendChild(commentIcon);

      footer.appendChild(likeButton);
      footer.appendChild(commentButton);
      content.appendChild(footer);

      li.appendChild(avatar);
      li.appendChild(content);
      postsListEl.appendChild(li);
    });
  }

  // ---------- ФОРМА СОЗДАНИЯ ПОСТА ----------
  const createPostForm = document.getElementById("create-post-form");
  const postTextInput = document.getElementById("post-text");
  const postImageInput = document.getElementById("post-image");

  // Авторасширение поля ввода
  function autoResize() {
    postTextInput.style.height = 'auto';
    postTextInput.style.height = postTextInput.scrollHeight + 'px';

    const createPostInner = document.querySelector('.create-post-inner');
    if (createPostInner) {
      createPostInner.style.height = 'auto';
    }
  }

  // Счетчик символов
  function updateCharCount() {
    const currentLength = postTextInput.value.length;
    const remaining = charLimit - currentLength;
    const charCountElement = document.getElementById('char-count') || createCharCountElement();
    const submitButton = document.querySelector('.btn-primary');

    if (currentLength > charLimit) {
      charCountElement.textContent = `-${currentLength - charLimit}`;
      charCountElement.style.color = '#ef4444';
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'not-allowed';
      submitButton.disabled = true;
    } else if (currentLength >= 900) {
      charCountElement.textContent = `${remaining}`;
      charCountElement.style.color = '#8b98a5';
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      submitButton.disabled = false;
    } else {
      charCountElement.textContent = '';
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      submitButton.disabled = false;
    }
  }

  function createCharCountElement() {
    const charCount = document.createElement('div');
    charCount.id = 'char-count';
    charCount.className = 'char-count';
    charCount.textContent = '';

    const createPostFooter = document.querySelector('.create-post-footer');
    if (createPostFooter) {
      createPostFooter.before(charCount);
    }
    return charCount;
  }

  // Превью фото в десктопной версии
  function createDesktopImagePreview() {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'desktop-image-preview-container';
    previewContainer.style.marginBottom = '16px';
    previewContainer.style.position = 'relative';

    const previewImage = document.createElement('img');
    previewImage.className = 'desktop-image-preview';
    previewImage.style.maxWidth = '100%';
    previewImage.style.maxHeight = '200px';
    previewImage.style.borderRadius = '16px';
    previewImage.style.display = 'none';
    previewImage.style.marginBottom = '12px';

    const removePreviewBtn = document.createElement('button');
    removePreviewBtn.className = 'desktop-remove-preview-btn';
    removePreviewBtn.textContent = '×';
    removePreviewBtn.style.position = 'absolute';
    removePreviewBtn.style.top = '8px';
    removePreviewBtn.style.right = '8px';
    removePreviewBtn.style.width = '24px';
    removePreviewBtn.style.height = '24px';
    removePreviewBtn.style.borderRadius = '50%';
    removePreviewBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    removePreviewBtn.style.color = 'white';
    removePreviewBtn.style.border = 'none';
    removePreviewBtn.style.cursor = 'pointer';
    removePreviewBtn.style.fontSize = '14px';
    removePreviewBtn.style.display = 'none';

    previewContainer.appendChild(previewImage);
    previewContainer.appendChild(removePreviewBtn);

    const createPostBody = document.querySelector('.create-post-body');
    const createPostFooter = document.querySelector('.create-post-footer');
    if (createPostBody && createPostFooter) {
      createPostFooter.before(previewContainer);
    }

    // Обработка выбора файла
    postImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          previewImage.src = event.target.result;
          previewImage.style.display = 'block';
          removePreviewBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });

    // Обработка удаления превью
    removePreviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      previewImage.style.display = 'none';
      previewImage.src = '';
      postImageInput.value = '';
      removePreviewBtn.style.display = 'none';
    });
  }

  // Обработка отправки формы
  createPostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = postTextInput.value.trim();
    const errorEl = document.getElementById("post-error");
    const now = Date.now();

    // Проверка лимита символов
    if (text.length > charLimit) {
      if (errorEl) {
        errorEl.style.display = "block";
        errorEl.textContent = "Слишком длинный пост, сократите до 1000 символов";
        createPostForm.classList.add("has-error");
      }
      return;
    }

    // Антиспам: не более 2 постов в минуту
    postTimestamps = postTimestamps.filter(ts => now - ts < 60_000);
    if (postTimestamps.length >= 2) {
      if (errorEl) {
        errorEl.style.display = "block";
        errorEl.textContent = "не спамь, погоди минуту";
        createPostForm.classList.add("has-error");
      }
      return;
    }

    if (!text) return;

    if (errorEl) {
      errorEl.style.display = "none";
      createPostForm.classList.remove("has-error");
    }

    const file = postImageInput.files[0];
    postTimestamps.push(now);

    // Если нет картинки
    if (!file) {
      const newPost = createPostObject(text, null);
      posts.push(newPost);
      postTextInput.value = "";
      postImageInput.value = "";
      // Очищаем превью если оно было
      const previewImage = document.querySelector('.desktop-image-preview');
      const removePreviewBtn = document.querySelector('.desktop-remove-preview-btn');
      if (previewImage) {
        previewImage.style.display = 'none';
        previewImage.src = '';
      }
      if (removePreviewBtn) {
        removePreviewBtn.style.display = 'none';
      }
      autoResize();
      updateCharCount();
      renderPosts();
      return;
    }

    // Если есть картинка
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      const newPost = createPostObject(text, imageUrl);
      posts.push(newPost);
      postTextInput.value = "";
      postImageInput.value = "";
      // Очищаем превью после публикации
      const previewImage = document.querySelector('.desktop-image-preview');
      const removePreviewBtn = document.querySelector('.desktop-remove-preview-btn');
      if (previewImage) {
        previewImage.style.display = 'none';
        previewImage.src = '';
      }
      if (removePreviewBtn) {
        removePreviewBtn.style.display = 'none';
      }
      autoResize();
      updateCharCount();
      renderPosts();
    };
    reader.readAsDataURL(file);
  });

  // Инициализация
  createDesktopImagePreview();
  postTextInput.addEventListener('input', autoResize);
  postTextInput.addEventListener('input', updateCharCount);
  postTextInput.addEventListener('keyup', updateCharCount);
  postTextInput.addEventListener('paste', (e) => {
    setTimeout(updateCharCount, 10);
  });

  // Тестовые посты
  posts = [
    createPostObject("Шестой тестовый пост. Дополнительный контент для проверки скроллинга. Этот пост завершает список тестовых постов."),
    createPostObject("Пятый тестовый пост. Последний пост в списке. Если вы видите этот пост, значит скроллинг работает правильно."),
    createPostObject("Четвертый тестовый пост. Еще больше контента для проверки скроллинга. Прокрутите вниз, чтобы увидеть все посты."),
    createPostObject("Третий тестовый пост. Добавим больше контента, чтобы было что скроллить. Этот пост должен быть достаточно длинным, чтобы создать скролл."),
    createPostObject("А это пост с тестовой картинкой. Можно загрузить свою, когда будете писать пост."),
    createPostObject("Добро пожаловать в «тупо». Это первый тестовый пост без картинки.")
  ];
  posts[0].likes = 6;
  posts[1].likes = 1;
  posts[2].likes = 4;
  posts[3].likes = 2;
  posts[4].likes = 5;
  posts[5].likes = 3;
  renderPosts();
  autoResize();
  updateCharCount();

  // ---------- МОБИЛЬНАЯ ВЕРСИЯ ----------
  const mobileCreatePostBtn = document.getElementById('mobile-create-post-btn');
  const mobileCreatePostModal = document.getElementById('mobile-create-post-modal');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileCreatePostForm = document.getElementById('mobile-create-post-form');
  const mobilePostText = document.getElementById('mobile-post-text');
  const mobileCharCount = document.getElementById('mobile-char-count');

  if (mobileCreatePostBtn && mobileCreatePostModal) {
    // Открытие/закрытие модального окна
    mobileCreatePostBtn.addEventListener('click', () => {
      mobileCreatePostModal.classList.add('active');
      mobilePostText.focus();
    });

    mobileCloseBtn.addEventListener('click', () => {
      mobileCreatePostModal.classList.remove('active');
      mobilePostText.value = '';
      mobileCharCount.textContent = '';
    });

    mobileCreatePostModal.addEventListener('click', (e) => {
      if (e.target === mobileCreatePostModal) {
        mobileCreatePostModal.classList.remove('active');
        mobilePostText.value = '';
        mobileCharCount.textContent = '';
      }
    });

    // Авторасширение в мобильной версии
    function mobileAutoResize() {
      mobilePostText.style.height = 'auto';
      mobilePostText.style.height = mobilePostText.scrollHeight + 'px';
    }

    mobilePostText.addEventListener('input', mobileAutoResize);

    // Счетчик символов в мобильной версии
    function mobileUpdateCharCount() {
      const currentLength = mobilePostText.value.length;
      const remaining = charLimit - currentLength;

      if (currentLength > charLimit) {
        mobileCharCount.textContent = `-${currentLength - charLimit}`;
        mobileCharCount.style.color = '#ef4444';
      } else if (currentLength >= 900) {
        mobileCharCount.textContent = `${remaining}`;
        mobileCharCount.style.color = '#8b98a5';
      } else {
        mobileCharCount.textContent = '';
      }
    }

    mobilePostText.addEventListener('input', mobileUpdateCharCount);
    mobilePostText.addEventListener('keyup', mobileUpdateCharCount);
    mobilePostText.addEventListener('paste', (e) => {
      setTimeout(mobileUpdateCharCount, 10);
    });

          // Обработка отправки формы в мобильной версии
          mobileCreatePostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = mobilePostText.value.trim();
            const now = Date.now();
            const errorEl = document.getElementById("mobile-post-error");

            // Проверка лимита символов
            if (text.length > charLimit) {
              if (errorEl) {
                errorEl.style.display = "block";
                errorEl.textContent = "Слишком длинный пост, сократите до 1000 символов";
                mobileCreatePostForm.classList.add("has-error");
              }
              return;
            }

            // Антиспам: не более 2 постов в минуту
            postTimestamps = postTimestamps.filter(ts => now - ts < 60_000);
            if (postTimestamps.length >= 2) {
              if (errorEl) {
                errorEl.style.display = "block";
                errorEl.textContent = "не спамь, погоди минуту";
                mobileCreatePostForm.classList.add("has-error");
              }
              return;
            }

            if (!text) return;

            const file = document.getElementById('mobile-post-image').files[0];
            let imageUrl = null;
            postTimestamps.push(now);

            // Скрываем ошибку если она была
            if (errorEl) {
              errorEl.style.display = "none";
              mobileCreatePostForm.classList.remove("has-error");
            }

            if (file) {
              const reader = new FileReader();
              reader.onload = function(event) {
                imageUrl = event.target.result;
                const newPost = createPostObject(text, imageUrl);
                posts.unshift(newPost);
                renderPosts();

                mobileCreatePostModal.classList.remove('active');
                mobilePostText.value = '';
                mobileCharCount.textContent = '';
                document.getElementById('mobile-post-image').value = '';
              };
              reader.readAsDataURL(file);
            } else {
              const newPost = createPostObject(text, null);
              posts.unshift(newPost);
              renderPosts();

              mobileCreatePostModal.classList.remove('active');
              mobilePostText.value = '';
              mobileCharCount.textContent = '';
              document.getElementById('mobile-post-image').value = '';
            }
          });
  }

  /* Добавляем глобальный обработчик скролла колесика мыши */
  document.addEventListener('wheel', function(e) {
    // Находим текущий скроллируемый элемент
    const scrollableElement = getCurrentScrollableElement();

    // Если есть скроллируемый элемент
    if (scrollableElement) {
      // Предотвращаем стандартное поведение скролла
      e.preventDefault();

      // Скроллим текущий элемент независимо от положения курсора
      scrollableElement.scrollTop += e.deltaY;
    }
  }, { passive: false });

  // Также добавляем обработчик для touch устройств
  let touchStartY = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    const scrollableElement = getCurrentScrollableElement();

    if (scrollableElement) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      scrollableElement.scrollTop += deltaY;
      touchStartY = touchY;

      e.preventDefault();
    }
  }, { passive: false });

  // Отдельный скроллбар у края окна
  const browserScrollbar = document.createElement('div');
  browserScrollbar.className = 'browser-scrollbar-thumb';
  document.querySelector('.browser-scrollbar').appendChild(browserScrollbar);

  const scrollbarThumb = document.querySelector('.browser-scrollbar-thumb');
  const scrollbarContainer = document.querySelector('.browser-scrollbar');

  let currentScrollableElement = null;

  function getCurrentScrollableElement() {
    const feedElement = document.querySelector('.feed');
    const searchElement = document.querySelector('.page-search .page-content.scrollable');
    const notificationsElement = document.querySelector('.page-notifications .page-content.scrollable');
    const accountElement = document.querySelector('.page-account .page-content.scrollable');

    const feedPage = document.querySelector('.page-home');
    const searchPage = document.querySelector('.page-search');
    const notificationsPage = document.querySelector('.page-notifications');
    const accountPage = document.querySelector('.page-account');

    if (!feedPage.hidden && feedElement) return feedElement;
    if (!searchPage.hidden && searchElement) return searchElement;
    if (!notificationsPage.hidden && notificationsElement) return notificationsElement;
    if (!accountPage.hidden && accountElement) return accountElement;

    return null;
  }

  function updateScrollbar() {
    const scrollableElement = getCurrentScrollableElement();
    if (!scrollableElement || !scrollbarThumb || !scrollbarContainer) return;

    const scrollPercentage = scrollableElement.scrollTop / (scrollableElement.scrollHeight - scrollableElement.clientHeight);
    const thumbPosition = scrollPercentage * (scrollbarContainer.clientHeight - scrollbarThumb.clientHeight);

    scrollbarThumb.style.top = thumbPosition + 'px';

    // Обновляем высоту ползунка в зависимости от соотношения контента
    const contentRatio = scrollableElement.clientHeight / scrollableElement.scrollHeight;
    const thumbHeight = Math.max(20, contentRatio * scrollbarContainer.clientHeight);
    scrollbarThumb.style.height = thumbHeight + 'px';
  }

  function setupScrollableElement(element) {
    if (!element) return;

    // Удаляем предыдущие обработчики, если они были
    if (currentScrollableElement) {
      currentScrollableElement.removeEventListener('scroll', updateScrollbar);
    }

    // Настраиваем новый элемент
    element.addEventListener('scroll', updateScrollbar);
    currentScrollableElement = element;
    updateScrollbar();
  }

  // Настраиваем обработчики для смены страниц (добавляем к существующим обработчикам)
  const existingNavButtons = document.querySelectorAll(".nav-item");
  existingNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      setTimeout(() => {
        const scrollableElement = getCurrentScrollableElement();
        setupScrollableElement(scrollableElement);
      }, 100);
    });
  });

  // Инициализируем скроллбар для текущей страницы
  const initialScrollableElement = getCurrentScrollableElement();
  setupScrollableElement(initialScrollableElement);

  // Обновляем скроллбар при изменении размера окна
  window.addEventListener('resize', updateScrollbar);

  // Обновляем при изменении истории (назад/вперед)
  window.addEventListener('popstate', () => {
    const scrollableElement = getCurrentScrollableElement();
    setupScrollableElement(scrollableElement);
  });
});
