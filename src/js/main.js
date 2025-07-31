document.addEventListener('DOMContentLoaded', () => {
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

  drawerTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const drawerName = trigger.dataset.drawer;
      const drawer = document.querySelector(`.header-drawer[data-drawer="${drawerName}"]`);

      if (drawer) {
        drawer.classList.add('show');
      }
    });
  });

  document.addEventListener('click', (e) => {
    drawers.forEach((drawer) => {
      if (drawer.classList.contains('show') && !drawer.contains(e.target)) {
        drawer.classList.remove('show');
      }
    });
  });

  drawers.forEach((drawer) => {
    const closeBtn = drawer.querySelector('.header-drawer__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('show');
      });
    }
  });
});
