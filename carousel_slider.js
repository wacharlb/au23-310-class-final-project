const carouselElement1 = document.getElementById('comicSlider1');
const carouselElement2 = document.getElementById('comicSlider2');
const carouselElement3 = document.getElementById('comicSlider3');
const carouselElement4 = document.getElementById('comicSlider4')

const carouselInstance1 = new bootstrap.Carousel(carouselElement1, {
    interval: false // Disable internal sliding
});
const carouselInstance2 = new bootstrap.Carousel(carouselElement2, {
    interval: false // Disable internal sliding
});
const carouselInstance3 = new bootstrap.Carousel(carouselElement3, {
    interval: false // Disable internal sliding
});
const carouselInstance4 = new bootstrap.Carousel(carouselElement4, {
    interval: false // Disable internal sliding
});

// Function to change the slide after a specified interval
function changeCarouselSlide() {;
    carouselInstance1.next(); // Move to the next slide
    carouselInstance2.next(); // Move to the next slide
    carouselInstance3.next(); // Move to the next slide
    carouselInstance4.next(); // Move to the next slide

    setTimeout(changeCarouselSlide, 5000);
}
  
// Initial call to start the carousel
setTimeout(changeCarouselSlide, 5000);