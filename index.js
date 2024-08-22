const result = document.querySelector(".product-list"); // all the products container
const categoryButtonsContainer = document.querySelector(".category-buttons"); //buttons container
const input = document.querySelector("input"); //search bar

const API_BASE_URL = "https://dummyjson.com/products";

const fetchByCategory = (category) =>
  fetch(`${API_BASE_URL}/category/${category}`).then((response) =>
    response.json()
  );

const fetchBySearch = (searchValue) =>
  fetch(`${API_BASE_URL}/search?q=${searchValue}`).then((response) =>
    response.json()
  );

const fetchAllProducts = () => {
  const cachedData = localStorage.getItem("products");
  if (cachedData) {
    return Promise.resolve(JSON.parse(cachedData));
  }
  return fetch(API_BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("products", JSON.stringify(data));
      return data;
    });
};

const fetchProducts = (searchValue = "", category = "") => {
  let fetchPromise;

  if (category) {
    fetchPromise = fetchByCategory(category);
  } else if (searchValue) {
    fetchPromise = fetchByCategory(searchValue).then((response) => {
      if (response.products.length === 0) {
        return fetchBySearch(searchValue);
      }
      return response;
    });
  } else {
    fetchPromise = fetchAllProducts();
  }
  fetchPromise.then((data) => productRender(data.products));
};

const productRender = (products) => {
  result.innerHTML = products
    .map(
      (product) => `
        <div  class=product onclick= "handleProductClick(event)" data-id= ${product.id}>
        <img loading="lazy" src=${product.thumbnail}>
        <div class=productDesc>
        <p>${product.title}</p>
        <p>Price: $${product.price}</p></div>
   
        </div>`
    )
    .join("");
};

const fetchCategoryList = () => {
  const cachedData = localStorage.getItem("categoryList");
  if (cachedData) {
    const categories = JSON.parse(cachedData);
    renderCategoryButtons(categories);
    return Promise.resolve(categories);
  }
  return fetch("https://dummyjson.com/products/category-list")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("categoryList", JSON.stringify(data));
      renderCategoryButtons(data);
      return data;
    })
    .catch((error) => console.error("Error fetching categories:", error));
};

const renderCategoryButtons = (categories) => {
  categoryButtonsContainer.innerHTML = categories
    .map(
      (category) =>
        `<button class = category-button data-category="${category}">${category}</button>
  `
    )
    .join("");

  document.querySelectorAll(".category-button").forEach((button) => {
    button.addEventListener("click", () => {
      fetchProducts(input.value, button.dataset.category);
    });
  });
};

fetchProducts();
fetchCategoryList();

const debounceFunction = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const callDebounce = debounceFunction(fetchProducts, 500);

input.addEventListener("input", (e) => {
  callDebounce(e.target.value);
});

function handleProductClick(event) {
  const productId = event.currentTarget.dataset.id;
  window.location.href = `product.html?id=${productId}`;
}
