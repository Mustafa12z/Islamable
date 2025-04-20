document.addEventListener('DOMContentLoaded', () => {
  const categoryContainer = document.getElementById('category-container');
  const flipbookContainer = document.getElementById('flipbook-container');
  const backButton = document.getElementById('back-btn');
  const duaContent = document.getElementById('dua-content');
  const nextButton = document.getElementById('next-btn');
  const prevButton = document.getElementById('prev-btn');

  let currentCategory = [];
  let currentDuaIndex = 0;

  window.showDuaCategory = function (categoryIndex) {
    currentCategory = duas[categoryIndex].duas;
    currentDuaIndex = 0;
    showFlipbook();
  };

  function showFlipbook() {
    categoryContainer.style.display = 'none';
    flipbookContainer.classList.remove('hidden');
    renderDua();
  }

  function renderDua() {
    if (currentDuaIndex < 0) currentDuaIndex = currentCategory.length - 1;
    if (currentDuaIndex >= currentCategory.length) currentDuaIndex = 0;

    const dua = currentCategory[currentDuaIndex];
    duaContent.innerHTML = `
      <h3 class="text-xl font-bold text-green-600 mb-4">${dua.title}</h3>
      <p class="mb-3"><strong class="font-semibold">Arabic:</strong> ${dua.arabic}</p>
      <p class="mb-3"><strong class="font-semibold">Translation:</strong> ${dua.translation}</p>
      <p class="text-gray-600"><strong class="font-semibold">Reference:</strong> ${dua.reference}</p>
    `;
  }

  nextButton.addEventListener('click', () => {
    currentDuaIndex++;
    renderDua();
  });

  prevButton.addEventListener('click', () => {
    currentDuaIndex--;
    renderDua();
  });

  backButton.addEventListener('click', () => {
    categoryContainer.style.display = 'grid';
    flipbookContainer.classList.add('hidden');
  });
});
