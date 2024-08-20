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

const fetchAllProducts = () =>
  fetch(API_BASE_URL).then((response) => response.json());

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
        <div class=product>
        <img loading="lazy" src=${product.thumbnail}>
        <div class=productDesc>
        <p>${product.title}</p>
        <p>Price: $${product.price}</p></div>
   
        </div>`
    )
    .join("");
};

const fetchCategoryList = () => {
  fetch("https://dummyjson.com/products/category-list")
    .then((res) => res.json())
    .then((categories) => {
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
    })
    .catch((error) => console.error("Error fetching categories:", error));
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

document.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.matches(".product")) {
    console.log("clicked");
  }
});
