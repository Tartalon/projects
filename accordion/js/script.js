document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion');
  const accordionContents = document.querySelectorAll(".accordion-content");

  accordions.forEach((itemAcc) => {
    itemAcc.addEventListener('click', (event) => {
      event.preventDefault();
      const context = itemAcc.nextElementSibling;

      if (context.style.maxHeight) {
        context.style.maxHeight = null;
        itemAcc.classList.remove('is-open');
      } else {
        context.style.maxHeight = context.scrollHeight + 'px';
        itemAcc.classList.add('is-open');
      }

      accordionContents.forEach((itemCon) => {
        if (itemCon !== context) {
          itemCon.style.maxHeight = null;
        }
      });

      accordions.forEach((item) => {
        if (item !== itemAcc) {
          item.classList.remove('is-open')
        }
      })
    });
  });
});