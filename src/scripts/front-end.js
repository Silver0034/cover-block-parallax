const blockSelectors = '.wp-block-cover, .wp-block-media-text'
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
	const sections = document.querySelectorAll(section)
	let ticking = false

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
			if (parallaxEl.style.height !== `${elementHeight}px`) {
				parallaxEl.style.height = `${elementHeight}px`
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
console.log('trigger on scroll')
