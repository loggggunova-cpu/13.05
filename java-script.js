document.addEventListener('DOMContentLoaded', () => {
  initOrderTable();
  initBookSlider();
});

function initOrderTable() {
  const formButton = document.querySelector('.avocado_button');
  const tableBody = document.querySelector('table tbody');

  if (!formButton || !tableBody) return;

  let count = tableBody.querySelectorAll('tr').length + 1;

  formButton.addEventListener('click', (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("input[name='name_off']");
    const dateInput = document.querySelector("input[name='date']");
    const diskSelect = document.querySelector("select[name='disk']");
    const typeSelect = document.querySelector("select[name='type']");

    if (!nameInput || !dateInput || !diskSelect || !typeSelect) return;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${count++}</td>
      <td>${nameInput.value}</td>
      <td>${dateInput.value}</td>
      <td><span class="sp_red">${diskSelect.value}</span></td>
      <td><span class="sp_green">${typeSelect.value}</span></td>
    `;

    tableBody.appendChild(newRow);
    nameInput.value = '';
    dateInput.value = '';
  });
}

function initBookSlider() {
  const slider = document.querySelector('.slider');
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slide');

  if (!slider || !sliderWrapper || slides.length === 0) return;

  let target = 0;
  let current = 0;
  const ease = 0.08;
  let maxScroll = Math.max(0, sliderWrapper.scrollWidth - window.innerWidth);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateScaleAndPosition() {
    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const centerPosition = (rect.left + rect.right) / 2;
      const distanceFromCenter = centerPosition - window.innerWidth / 2;
      const normalizedDistance = Math.abs(distanceFromCenter) / window.innerWidth;
      const scale = clamp(1.08 - normalizedDistance * 0.35, 0.86, 1.08);
      slide.style.transform = `scale(${scale})`;
    });
  }

  function update() {
    current = lerp(current, target, ease);
    sliderWrapper.style.transform = `translate3d(${-current}px, 0, 0)`;
    updateScaleAndPosition();
    requestAnimationFrame(update);
  }

  function recalc() {
    maxScroll = Math.max(0, sliderWrapper.scrollWidth - window.innerWidth);
    target = clamp(target, 0, maxScroll);
  }

  window.addEventListener('resize', recalc);

  slider.addEventListener('wheel', (event) => {
    event.preventDefault();
    target = clamp(target + event.deltaY + event.deltaX, 0, maxScroll);
  }, { passive: false });

  let startX = 0;
  let startTarget = 0;
  let isDragging = false;

  slider.addEventListener('pointerdown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startTarget = target;
    slider.setPointerCapture(event.pointerId);
  });

  slider.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    target = clamp(startTarget - (event.clientX - startX), 0, maxScroll);
  });

  slider.addEventListener('pointerup', () => {
    isDragging = false;
  });

  slider.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  recalc();
  update();
}
