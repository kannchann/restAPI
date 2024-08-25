const result = document.querySelector(".product-list"); // all the products container
const categoryButtonsContainer = document.querySelector(".category-buttons"); //buttons container
const input = document.getElementById("search"); //search bar
//modal
const addProductButton = document.querySelector(".add-product-button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".btn-close");

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
        <div class="image-container"> <img loading="lazy" src=${product.images[0]}></div>
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

addProductButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

const closeModal = function () {
  overlay.classList.add("hidden");
  modal.classList.add("hidden");
};

overlay.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);

// form.js
const form = document.getElementById("form");
const title = document.getElementById("title");
const price = document.getElementById("price");
const brand = document.getElementById("brand");
const thumbnail = document.getElementById("thumbnail");
const thumbnailPreview = document.getElementById("thumbnail-preview");

function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

function clearError(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control";
  const small = formControl.querySelector("small");
  small.innerText = "";
}

function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function checkRequired(inputArr) {
  let isValid = true;
  inputArr.forEach(function (input) {
    if (input.type === "file") {
      if (!input.files[0]) {
        showError(input, `${getFieldName(input)} is required`);
        isValid = false;
      } else {
        clearError(input);
      }
    } else if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      isValid = false;
    } else {
      clearError(input);
    }
  });
  return isValid;
}

function checkLettersOnly(inputArr) {
  const lettersOnlyRegex = /^[A-Za-z]+$/;
  let isValid = true;

  inputArr.forEach(function (input) {
    const value = input.value.trim();
    if (value !== "" && !lettersOnlyRegex.test(value)) {
      showError(input, `${getFieldName(input)} can only contain letters`);
      isValid = false;
    } else if (value !== "") {
      clearError(input);
    }
  });

  return isValid;
}

function checkImageFile(input) {
  const allowedExtensions = ["image/jpeg", "image/png", "image/gif"];
  if (input.files[0] && !allowedExtensions.includes(input.files[0].type)) {
    showError(input, "Only JPEG, PNG, and GIF files are allowed");
    return false;
  }
  return true;
}

function previewImage() {
  const file = thumbnail.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      thumbnailPreview.src = e.target.result;
      thumbnailPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

thumbnail.addEventListener("change", previewImage);

const errorCheck = (e) => {
  const isFormValid = checkRequired([title, price, brand, thumbnail]);
  const isLettersValid = checkLettersOnly([title, price, brand]);
  const isThumbnailValid = checkImageFile(thumbnail);

  if (!isFormValid || !isLettersValid || !isThumbnailValid) {
    e.preventDefault(); // Prevent form submission if there are errors
    return; // Stop further execution
  }

  const productDetails = [
    title.value,
    price.value,
    brand.value,
    thumbnail.files[0],
  ];

  console.log(productDetails); // Log the array or use it as needed
};

form.addEventListener("submit", errorCheck);
