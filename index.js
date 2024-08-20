const result = document.querySelector(".product-list"); // all the products container
const categoryButtonsContainer = document.querySelector(".category-buttons"); //buttons container
const input = document.querySelector("input"); //search bar

const fetchProducts = (searchValue = "", category = "") => {
  let endpoint = "https://dummyjson.com/products";

  if (category) {
    endpoint = `https://dummyjson.com/products/category/${category}`;
  } else if (searchValue) {
    endpoint = `https://dummyjson.com/products/search?q=${searchValue}`;
  }
  fetch(endpoint)
    .then((response) => response.json())
    .then((list) => {
      result.innerHTML = list.products
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
    });
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
          fetchProducts(("", button.dataset.category));
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
