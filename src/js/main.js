document.addEventListener('DOMContentLoaded', () => {
  Fancybox.bind('[data-fancybox]', {
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
    Thumbs: false,
    Images: {
      zoom: false,
    },
  });

  const maskOptions = {
    mask: '+7 (000) 000-00-00',
    onFocus() {
      if (this.value === '') this.value = '+7 ';
    },
    onBlur() {
      if (this.value === '+7 ') this.value = '';
    },
  };

  document.querySelectorAll('.masked').forEach((item) => new IMask(item, maskOptions));

  const header = document.querySelector('.header');
  const headerCatalogLink = header.querySelector('.js-header-catalog');
  const headerCatalogContainer = header.querySelector('.header-catalog');

  headerCatalogLink.addEventListener('click', (e) => {
    e.stopPropagation();
    headerCatalogLink.classList.toggle('active');
    headerCatalogContainer.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      headerCatalogLink.classList.remove('active');
      headerCatalogContainer.classList.remove('show');
    }
  });

  const drawerTriggers = document.querySelectorAll('.js-header-drawer');
  const drawers = document.querySelectorAll('.header-drawer');

  const openStack = [];

  const openDrawer = (drawer) => {
    if (!drawer) return;
    drawer.classList.add('show');
    const i = openStack.indexOf(drawer);
    if (i !== -1) openStack.splice(i, 1);
    openStack.push(drawer);
  };

  const closeLast = () => {
    const last = openStack.pop();
    if (last) last.classList.remove('show');
  };

  const isClickInsideAnyOpen = (target) => {
    return openStack.some((d) => d.contains(target));
  };

  drawerTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const drawerName = trigger.dataset.drawer;
      const drawer = document.querySelector(`.header-drawer[data-drawer="${drawerName}"]`);
      openDrawer(drawer);
    });
  });

  document.addEventListener('click', (e) => {
    if (openStack.length === 0) return;
    if (isClickInsideAnyOpen(e.target)) return;
    closeLast();
  });

  drawers.forEach((drawer) => {
    const closeBtn = drawer.querySelector('.header-drawer__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLast();
      });
    }
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ target }) => {
      if (target.classList && !target.classList.contains('show')) {
        const i = openStack.indexOf(target);
        if (i !== -1) openStack.splice(i, 1);
      }
    });
  });
  drawers.forEach((d) => observer.observe(d, { attributes: true, attributeFilter: ['class'] }));

  document.querySelectorAll('.catalog-card').forEach((card) => {
    const pic = card.querySelector('.catalog-card__pic');
    const img = pic.querySelector('.catalog-card__image');
    const images = pic.dataset.images.split(',');
    const zoneCount = images.length;

    let isHovering = false;

    pic.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    pic.addEventListener('mousemove', (e) => {
      if (!isHovering) return;

      const rect = pic.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const zoneWidth = rect.width / zoneCount;
      const index = Math.max(0, Math.min(zoneCount - 1, Math.floor(relativeX / zoneWidth)));

      img.src = images[index];
    });

    pic.addEventListener('mouseleave', () => {
      isHovering = false;
      img.src = images[0];
    });

    const favoriteIcon = card.querySelector('.catalog-card__favorite');
    favoriteIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      favoriteIcon.classList.toggle('liked');
    });
  });

  const searchBlock = document.querySelector('.catalog-filter__search');
  const searchText = document.querySelector('.catalog-filter__search-text');

  searchText?.addEventListener('click', function (e) {
    searchBlock.classList.add('show');
    e.stopPropagation();
  });

  document.addEventListener('click', function (e) {
    if (!searchBlock?.contains(e.target)) {
      searchBlock?.classList.remove('show');
    }
  });

  const favoriteIcon = document.querySelector('.item-info__favorite');
  favoriteIcon?.addEventListener('click', (e) => {
    favoriteIcon.classList.toggle('liked');
  });

  const thumbnails = document.querySelectorAll('.item-gallery__thumbnails li');
  const fullImages = document.querySelectorAll('.item-gallery__full img');
  let offset = window.innerWidth <= 1024 ? 60 : window.innerWidth <= 1600 ? 76 : 92;

  let ticking = false;

  function updateActiveThumbnail() {
    let current = 0;

    fullImages.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      if (rect.top - offset <= 0) {
        current = index;
      }
    });

    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveThumbnail);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);

  const collectionsGrid = document.querySelector('.about-collections__grid');
  if (collectionsGrid && window.innerWidth >= 768) {
    setTimeout(() => {
      const collectionsGridMasonry = new Masonry(collectionsGrid, {
        itemSelector: '.about-collections__item',
        transitionDuration: 0,
        gutter: window.innerWidth <= 1024 ? 30 : 40,
      });
    }, 100);
  }

  var main = new Splide('.item-carousel__main', {
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
  });

  var thumbnail = new Splide('.item-carousel__thumbnails', {
    fixedWidth: 72,
    fixedHeight: 100,
    gap: 12,
    rewind: true,
    pagination: false,
    isNavigation: true,
    arrows: false,
  });

  main.sync(thumbnail);
  main.mount();
  thumbnail.mount();
});
