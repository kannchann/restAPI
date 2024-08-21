const productDetailsContainer = document.querySelector(
  ".product-details-container"
);

const urlParams = new URLSearchParams(window.location.search); //eturns a URLSearchParams object that has methods to work with query strings
const productId = urlParams.get("id"); //get the value of the query parameter using the get()

const productDetails = () =>
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((response) => response.json())
    .then((data) => productDetailsRender(data));

const productDetailsRender = (product) => {
  productDetailsContainer.innerHTML = `<div><img loading="lazy" src= ${product.thumbnail}></div>`;
};

productDetails();
