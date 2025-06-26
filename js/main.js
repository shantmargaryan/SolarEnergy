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
    threshold: 0.2
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
            delay: 2000,
        },
        loop: true,
        spaceBetween: 10,
    });
}

