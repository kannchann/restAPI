const productDetailsContainer = document.querySelector(
  ".product-detail-container"
);

const urlParams = new URLSearchParams(window.location.search); //eturns a URLSearchParams object that has methods to work with query strings
const productId = urlParams.get("id"); //get the value of the query parameter using the get()

const productDetails = () =>
  fetch(`https://dummyjson.com/products/${productId}`)
    .then((response) => response.json())
    .then((data) => productDetailsRender(data));

const productDetailsRender = (product) => {
  const reviewsHTML = product.reviews
    .map(
      (review) => `<div class="review">
  <div class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(
        5 - review.rating
      )}</div>
  <p class="review-comment">"${review.comment}"</p>
  <p class="review-author">By ${review.reviewerName} on ${new Date(
        review.date
      ).toLocaleDateString()}</p>
</div></br>`
    )
    .join("");

  productDetailsContainer.innerHTML = `<div class= main-image-div>
  <img loading="lazy" src= ${product.thumbnail}></div>
  <div class="title"><h2>${product.title}</h2>
  <p>Brand: ${product.brand}</p>
  <span class="product-price">$${product.price.toFixed(2)}</span>
  <span class="product-discount">-${product.discountPercentage}%</span>
  <hr/>
  <div class="product-info">
          
    <p class="product-description">${product.description}</p>
    <div class="product-meta">
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Stock:</strong> ${product.stock}</p>
    <p><strong>Weight:</strong> ${product.weight} oz</p>
    <p><strong>Dimensions:</strong> ${product.dimensions.width}" x ${
    product.dimensions.height
  }" x ${product.dimensions.depth}"</p>
   </div>
  </div>
  
 
<div class="accordian">
<div class="content-container">
    <div class="question">Additional Information</div>
    <div class="answer">
    <p><strong>Warranty:</strong> ${product.warrantyInformation}</p>
        <p><strong>Shipping:</strong> ${product.shippingInformation}</p>
        <p><strong>Availability:</strong> ${product.availabilityStatus}</p>
        <p><strong>Return Policy:</strong> ${product.returnPolicy}</p>
        <p><strong>Minimum Order Quantity:</strong> ${
          product.minimumOrderQuantity
        }</p>
    </div>
</div>
<div class="content-container">
    <div class="question">Customer Reviews</div>
    <div class="answer">
        ${reviewsHTML}
    </div>
</div>
</div>`;
};

document.body.addEventListener("click", function (event) {
  const parent = event.target.closest(".content-container");
  if (parent && event.target.classList.contains("question")) {
    parent.classList.toggle("active");
  }
});

productDetails();
