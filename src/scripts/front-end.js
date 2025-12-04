const blockSelectors =
	'.wp-block-cover, .wp-block-media-text.is-image-fill-element'
const imageSelectors =
	'.wp-block-cover__image-background, .wp-block-media-text__media img'

const debounce = (func, wait) => {
	let timeout
	return (...args) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}

const backgroundParallax = (section) => {
	const allSections = document.querySelectorAll(section)
	let ticking = false

	// filter out all sections that have class no-parallax
	const sections = Array.from(allSections).filter(
		(el) => !el.classList.contains('no-parallax')
	)

	sections.forEach((element) => {
		const parallaxEl = element.querySelector(imageSelectors)
		if (!parallaxEl) return
		parallaxEl.outerHTML = `<div class="background-wrapper" style="position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;overflow:hidden;">${parallaxEl.outerHTML}</div>`
	})

	const update = () => {
		const windowScroll = window.scrollY
		const windowHeight = window.innerHeight

		sections.forEach((element) => {
			const parallaxEl = element.querySelector(imageSelectors)
			if (!parallaxEl) return

			const sectionRect = element.getBoundingClientRect()
			const sectionHeight = element.offsetHeight
			const threshold = 50
			const elementHeight = sectionHeight + threshold
			const sectionTop = windowScroll + sectionRect.top
			const speed =
				(windowHeight + sectionHeight) / (elementHeight - sectionHeight)

			let translate = 0
			if (
				sectionTop + sectionHeight > windowScroll &&
				sectionTop < windowScroll + windowHeight
			) {
				translate = (windowScroll + windowHeight - sectionTop) / speed
			}

			// Only update if value changed
			let newHeight = `${elementHeight}px`
			if (
				element.classList.contains('wp-block-media-text') &&
				element.classList.contains('is-stacked-on-mobile') &&
				window.innerWidth < 600
			) {
				newHeight = 'auto'
			}
			if (parallaxEl.style.height !== newHeight) {
				parallaxEl.style.height = newHeight
			}
			parallaxEl.style.setProperty('--translate-y', `${-translate}px`)
		})
		ticking = false
	}

	const onScroll = () => {
		if (!ticking) {
			requestAnimationFrame(update)
			ticking = true
		}
	}

	window.addEventListener('scroll', onScroll)

	onScroll()
}

backgroundParallax(blockSelectors)
