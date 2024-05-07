const
    $ = x => document.querySelector(x),
    $$ = (x, y) => x.querySelector(y),
    $$$ = x => document.querySelectorAll(x),
    $$$$ = (x, y) => x.querySelectorAll(y);

(() => {
    function SecondsToTimestamp(someTime) {
        const minutes = (someTime / 60) | 0
        someTime -= minutes * 60
        return `${minutes}:${(someTime | 0).toString().padStart(2, '0')}`
    }

    // Logic for Audio Elements
    $$$('.element-audio').forEach(audioElement => {
        const
            dataSource = audioElement.getAttribute('data-src'),
            elemAudio = $$(audioElement, 'audio'),
            elemProgress = $$(audioElement, 'input'),
            elemButton = $$(audioElement, 'button'),
            elemButtonIcon = $$(audioElement, 'button img'),
            elemTime = $$(audioElement, 'p.audio-time')

        let isLoaded = false
        let isDragging = false
        let ignoreInput = false
        elemButton.onclick = () => {
            if (ignoreInput) return
            if (!isLoaded) {
                // Load Audio Source
                ignoreInput = true
                elemAudio.src = dataSource
                elemAudio.oncanplay = () => {
                    // Playtime
                    elemProgress.removeAttribute('disabled')
                    function updateTimestamp() {
                        elemTime.textContent = `${SecondsToTimestamp(elemAudio.currentTime)}/${SecondsToTimestamp(elemAudio.duration)}`
                        if (!isDragging) elemProgress.value = ((100 / elemAudio.duration) * elemAudio.currentTime) | 0
                    }
                    elemAudio.ontimeupdate = updateTimestamp

                    // Seeking
                    elemProgress.onmousedown = () => isDragging = true
                    elemProgress.onmouseup = () => isDragging = false
                    elemProgress.onchange = () => elemAudio.currentTime = elemAudio.duration * (elemProgress.value / 100) | 0

                    // Controls
                    elemAudio.onplaying = () => elemButtonIcon.src = '/assets/images/icons/icon-pause.svg'
                    elemAudio.onpause = () => elemButtonIcon.src = '/assets/images/icons/icon-play.svg'
                    elemAudio.play()

                    // Debounce
                    ignoreInput = false
                    isLoaded = true
                }
                return
            }

            elemAudio.paused ? elemAudio.play() : elemAudio.pause()
        }
    });

    // Logic for Link Highlighting
    let scrollDebounce = false
    const contentWrapper = $('.layout-content')
    const linkElement = Array
        .from($$$('.aside-anchor'))
        .map(e => {
            const href = e.href.split('#').at(-1)
            return [e, href ? document.querySelector(`p#${href}`) : null]
        })
        .filter(e => e[1])

    function onPageScroll() {
        linkElement.forEach(([link, header], i, a) => {
            const x = contentWrapper.scrollTop + 32;
            (
                x >= (i === 0 ? 0 : header.offsetTop) &&
                x <= (a[i + 1]?.[1].offsetTop || Infinity)
            )
                ? link.classList.add('active')
                : link.classList.remove('active')
        })
    }
    contentWrapper.addEventListener('scroll', () => {
        if (scrollDebounce) return
        scrollDebounce = true
        window.requestAnimationFrame(() => {
            onPageScroll()
            scrollDebounce = false
        })
    })
    onPageScroll()

})()