import { useEffect } from 'react'

/**
 * Active les animations « scroll reveal » sur les éléments portant
 * la classe .reveal / .reveal-left / .reveal-right présents dans le DOM.
 * Relance l'observation à chaque changement de `deps` (ex. changement de langue
 * ou retour sur la page d'accueil).
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
    )
    if (!els.length) return

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
