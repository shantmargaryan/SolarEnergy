  const items = document.querySelectorAll('.project__item');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const itemsToShow = 4; // Number of items to show initially and per click
  let visibleCount = itemsToShow;

  // Hide all items except the first few
  items.forEach((item, idx) => {
    if (idx >= itemsToShow) item.style.display = 'none';
  });

  loadMoreBtn.addEventListener('click', function () {
    for (let i = visibleCount; i < visibleCount + itemsToShow; i++) {
      if (items[i]) items[i].style.display = '';
    }
    visibleCount += itemsToShow;
    if (visibleCount >= items.length) {
      loadMoreBtn.style.display = 'none';
    }
  });

  // Hide button if all items fit
  if (items.length <= itemsToShow) {
    loadMoreBtn.style.display = 'none';
  }