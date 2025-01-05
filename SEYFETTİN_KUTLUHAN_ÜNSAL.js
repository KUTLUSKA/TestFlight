(function () {
    const apiUrl = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';

    $(document).ready(function () {
        // Eğer .product-detail sayfası yoksa, işlem yapma.
        if (!$('.product-detail').length) return;

        let products = JSON.parse(localStorage.getItem('products'));

        // Eğer ürün verisi local'de yoksa, API'den çek.
        if (!products) {
            $.getJSON(apiUrl, function (data) {
                products = data;
                localStorage.setItem('products', JSON.stringify(products));
                createCarousel(products); // Ürünleri alıp carousel oluştur.
            });
        } else {
            createCarousel(products); // Zaten varsa, carousel oluştur.
        }

        // Pop-up gösterimi
        createPopup();
    });
    // Carousel (slider) oluşturma fonksiyonu
    function createCarousel(products) {
        const carouselContainer = $('<div class="carousel-container"></div>');
        const title = $('<h3 class="carousel-title">You Might Also Like</h3>');
        carouselContainer.append(title);

        const carousel = $('<div class="carousel"></div>');
        const prevButton = $('<button class="carousel-arrow prev">←</button>');
        const nextButton = $('<button class="carousel-arrow next">→</button>');

        const productList = $('<div class="carousel-items"></div>');
        let currentIndex = 0;

        const itemsPerView = getItemsPerView();
        const totalItems = products.length;
        const itemWidth = 100 / itemsPerView;

        products.forEach(product => {
            const productItem = $('<div class="product-item"></div>');
            const productCard = $('<div class="product-card"></div>');
            const productLink = $('<a></a>').attr('href', product.url).attr('target', '_blank');

            const productImage = $('<img>')
                .attr('src', product.img)
                .attr('alt', product.name);

            const productName = $('<div class="product-name"></div>').text(product.name);
            const productPrice = $('<div class="product-price"></div>').text(`₺${product.price}`);

            const heartIcon = $('<span class="heart-icon">🤍</span>');
            heartIcon.click(function (e) {
                e.stopPropagation();

                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const index = favorites.indexOf(product.id);
                if (index === -1) {
                    favorites.push(product.id);
                    heartIcon.css('color', 'blue').text('💙');
                } else {
                    favorites.splice(index, 1);
                    heartIcon.css('color', 'black').text('🤍');
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            });

            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favorites.includes(product.id)) {
                heartIcon.css('color', 'blue').text('💙');
            }

            productLink.append(productImage, productName, productPrice);
            productCard.append(productLink, heartIcon);
            productItem.append(productCard);
            productList.append(productItem);
        });

        productList.css('width', `${itemWidth * totalItems}%`);
        carousel.append(prevButton, productList, nextButton);
        carouselContainer.append(carousel);
        $(".product-detail").after(carouselContainer);
        addCarouselStyles();

         // Carousel'ı güncelleyen fonksiyon.
        function updateCarousel() {
            const maxIndex = Math.max(0, totalItems - Math.ceil(itemsPerView)) + 0.5;
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            const offset = -currentIndex * itemWidth;
            productList.css('transform', `translateX(${offset}%)`);
        }

        prevButton.click(function () {
            if (currentIndex > 0) {
                currentIndex -= 1;
            }
            updateCarousel();
        });

        nextButton.click(function () {
            if (currentIndex < totalItems - itemsPerView + 0.5) {
                currentIndex += 1;
            }
            updateCarousel();
        });

        updateCarousel();
    }

    // Ekran genişliğine göre kaç öğe gösterileceğini hesaplar.
    function getItemsPerView() {
        const width = $(window).width();
        if (width >= 900) {
            return 6.5; // Geniş ekranlarda 6.5 öğe
        } else if (width >= 600) {
            return 4; // Orta ekranlarda 4 öğe
        } else if (width >= 400) {
            return 3; // Küçük ekranlarda 3 öğe
        } else {
            return 2; // Çok küçük ekranlarda 2 öğe
        }
    }

    // Carousel için stilleri ekleyen fonksiyon.
    function addCarouselStyles() {
        const style = `
            <style>
                .carousel-container {
                    width: 100%;
                    overflow: hidden;
                    margin-top: 20px;
                }
                .carousel-title {
                    text-align: center;
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    margin-top: -10px;
                }
                .carousel {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .carousel-items {
                    display: flex;
                    transition: transform 0.5s ease-in-out;
                    margin: 0;
                    padding: 0;
                }
                .product-item {
                    flex: 0 0 auto;
                    width: calc(${100 / 6.5}% - 10px);
                    text-align: center;
                    position: relative;
                    margin-right: 10px;
                }
                .product-item:last-child {
                    margin-right: 0;
                }
                .product-card {
                    position: relative;
                    padding: 10px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                }
                .product-item img {
                    width: 100%;
                    height: auto;
                    max-width: 200px;
                    margin-bottom: 10px;
                    display: block;
                    border-radius: 10px;
                }
                .product-name {
                    font-size: 16px;
                    margin-top: 5px;
                    color: #333;
                    font-weight: bold;
                }
                .product-price {
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 5px;
                    color: #555;
                }
                .heart-icon {
                    position: absolute;
                    top: 5%;
                    right: 5%;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 2;
                    color: black;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 50%;
                    padding: 5px;
                    transition: all 0.3s ease;
                }
                .heart-icon:hover {
                    background-color: rgba(0, 0, 0, 0.5);
                    color: #fff;
                }
                .carousel-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    padding: 10px;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 1;
                }
                .carousel-arrow.prev {
                    left: 10px;
                }
                .carousel-arrow.next {
                    right: 10px;
                }
                .custom-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    display: none;
                }

                .popup-content {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }

                .popup-content p {
                    margin-bottom: 20px;
                    font-size: 18px;
                }

                .popup-close {
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .popup-close:hover {
                    background-color: #0056b3;
                }
            </style>
        `;
        $('head').append(style);
    }
    // Kullanıcıya teşekkür amaçlı pop-up gösterimi
    function createPopup() {
        const popup = $(`
            <div class="custom-popup">
                <div class="popup-content">
                    <p>Sizlerle bu değerlendirmeyi yapmak bile benim için çok değerli, umarım beğenirsiniz ve ilerde birlikte çalışırız.</p>
                    <button class="popup-close">Kapat</button>
                </div>
            </div>
        `);

        $('body').append(popup);

        $('.custom-popup').slideDown(300);

        $('.popup-close').click(function () {
            $('.custom-popup').slideUp(300);
        });
    }
})();
