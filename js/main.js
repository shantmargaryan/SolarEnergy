const header = document.querySelector(".header");
const links = document.querySelectorAll(".nav__link");
const nav = document.querySelector(".nav");
const burger = document.querySelector(".burger");
const overlay = document.querySelector(".main__overlay");
const img = document.querySelectorAll("img[data-src]");

links.forEach(link => {
    if (location.href.includes(link.href)) {
        link.classList.add("nav__link_active");
    }
});



const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            if (target.hasAttribute('data-src')) {
                target.src = target.getAttribute('data-src');
                target.removeAttribute('data-src');
            }
            target.classList.add('scroll-active');
            observer.unobserve(target);
        }
    });
}, {
    rootMargin: "100px 0px 0px 0px",
    threshold: 0.5
});

const images = document.querySelectorAll('img[data-src]');
images.forEach(img => observer.observe(img));

const animationItems = document.querySelectorAll('.animation-item');
animationItems.forEach(item => observer.observe(item));

burger.addEventListener("click", function () {
    burger.classList.toggle("burger_active");
    overlay.classList.toggle("main__overlay_active");
    nav.classList.toggle("nav_active");
    if (burger.classList.contains("burger_active")) {
        header.classList.add("header_active")
        nav.style.paddingTop = header.offsetHeight + "px";
        disableScroll();
    } else {
        setTimeout(() => {
            nav.style.paddingTop = "";
        }, 300);
        header.classList.remove("header_active");
        enableScroll();
    }
    document.body.addEventListener("click", function (e) {
        if (e.target === overlay) {
            burger.classList.remove("burger_active");
            overlay.classList.remove("main__overlay_active");
            nav.classList.remove("nav_active");
            header.classList.remove("header_active");
            enableScroll();
        }
    });
});

const disableScroll = () => {
    const fixBlocks = document?.querySelectorAll('.fixed-block');
    const pagePosition = window.scrollY;
    const paddingOffset = `${(window.innerWidth - document.body.offsetWidth)
        }px`;

    document.documentElement.style.scrollBehavior = 'none';
    fixBlocks.forEach(el => { el.style.paddingRight = paddingOffset; });
    document.body.style.paddingRight = paddingOffset;
    document.body.classList.add('dis-scroll');
    document.body.dataset.position = pagePosition;
    document.body.style.top = `-${pagePosition} px`;
}

const enableScroll = () => {
    const fixBlocks = document?.querySelectorAll('.fixed-block');
    const pagePosition = parseInt(document.body.dataset.position, 10);
    fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
    document.body.style.paddingRight = '0px';

    document.body.style.top = 'auto';
    document.body.classList.remove('dis-scroll');
    window.scroll({
        top: pagePosition,
        left: 0
    });
    document.body.removeAttribute('data-position');
}

const mediaQueryMinWidth_992 = window.matchMedia('(min-width: 992px)');
mediaQueryMinWidth_992.addEventListener("change", (e) => {
    if (e.matches) {
        nav.style.paddingTop = "";
        return true;
    }
    else {
        nav.style.paddingTop = header.offsetHeight + "px";
    }
    return false;
});


if (document.querySelector("[data-fancybox='gallery']")) {
    Fancybox.bind('[data-fancybox="gallery"]', {
    });
}


if (document.querySelector('.features__swiper')) {
    const swiper = new Swiper('.features__swiper', {
        slidesPerView: 3,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
        },
        // Auto play
        autoplay: {
            delay: 3000,
        },
        loop: true,
        spaceBetween: 20,
    });
}


/**
 * Converts any <img> src format to WebP in the browser.
 * @param {HTMLImageElement} imgElement - The image element to convert.
 * @param {number} [quality=0.8] - WebP quality (0 to 1).
 * @returns {Promise<string>} - Resolves to a WebP data URL.
 */
function convertImgSrcToWebp(imgElement, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = imgElement.crossOrigin || 'anonymous';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const webpDataUrl = canvas.toDataURL('image/webp', quality);
            resolve(webpDataUrl);
        };
        img.onerror = reject;
        img.src = imgElement.src;
    });
}

// Optimized: Convert all <img> src formats to WebP after the website loads, including dynamically added images
(function () {
    function convertToWebp(img) {
        if (!img.src || img.src.startsWith('data:image/webp') || img.dataset.webpConverted) return;
        img.dataset.webpConverted = 'true';
        if (!img.complete) {
            img.addEventListener('load', () => convertToWebp(img), { once: true });
            return;
        }
        const originalSrc = img.src;
        const imgCopy = new window.Image();
        imgCopy.crossOrigin = img.crossOrigin || 'anonymous';
        imgCopy.onload = function () {
            try {
                const w = imgCopy.naturalWidth || imgCopy.width;
                const h = imgCopy.naturalHeight || imgCopy.height;
                if (!w || !h) {
                    console.warn('Image has zero width/height:', originalSrc);
                    return;
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgCopy, 0, 0, w, h);
                try {
                    const webpDataUrl = canvas.toDataURL('image/webp', 0.2);
                    img.src = webpDataUrl;
                } catch (e) {
                    console.warn('WebP export failed (possible CORS issue) for', originalSrc, e);
                }
            } catch (e) {
                console.warn('WebP conversion failed for', originalSrc, e);
            }
        };
        imgCopy.onerror = function (e) {
            console.warn('Image load failed for', originalSrc, e);
        };
        imgCopy.src = originalSrc;
    }

    function convertAllImages() {
        document.querySelectorAll('img').forEach(convertToWebp);
    }

    window.addEventListener('DOMContentLoaded', function () {
        convertAllImages();
        // Observe for dynamically added images
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'IMG') {
                        convertToWebp(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(convertToWebp);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
