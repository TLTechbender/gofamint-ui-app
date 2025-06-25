// lib/smoothScroll.ts
export const smoothScrollTo = (targetId: string, offset = 0) => {
  const target = document.getElementById(targetId);
  if (target) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};