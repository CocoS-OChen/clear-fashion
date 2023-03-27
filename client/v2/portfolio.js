'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let filtered_products = [];
let brand_filter = x => true;
let reasonable_filter = x => true;
let recent_filter = x => true;


// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const recentlyReleased = document.querySelector('#recently-released');
const reasonablePrice = document.querySelector('#reasonable-price');
const priceP50 = document.querySelector('#p50');
const priceP90 = document.querySelector('#p90');
const priceP95 = document.querySelector('#p95');
const spanLastRelease = document.querySelector('#last-release');


// Update brands choice

function update_brands_name(){
  let old_value = selectBrand.value
  selectBrand.innerHTML = '<option>all</option>';
  
  const brands_name = [];
  let my_option;
  currentProducts.forEach(article =>{
    if(!brands_name.includes(article.brand)){
      brands_name.push(article.brand)
      my_option = document.createElement('option');
      my_option.innerHTML = article.brand;
      selectBrand.appendChild(my_option);
    }
  })
  selectBrand.value = brands_name.includes(old_value)? old_value:'all';
}

const apply_all_filters = (products) =>{
  let filter = [brand_filter, reasonable_filter, recent_filter]
  filter.forEach(f =>{
    products = products.filter(f)
  })
  return products
}

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  update_brands_name();
  filtered_products = apply_all_filters(currentProducts)
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const productsDiv = document.createElement('div');
  productsDiv.classList.add('products');

  for (const product of products) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const brandSpan = document.createElement('span');
    brandSpan.textContent = product.brand.charAt(0).toUpperCase() + product.brand.slice(1);
    productDiv.appendChild(brandSpan);

    const nameLink = document.createElement('a');
    nameLink.href = product.link;
    nameLink.textContent = product.name;
    productDiv.appendChild(nameLink);

    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price + '€';
    productDiv.appendChild(priceSpan);

    const image = document.createElement('img');
    const imageUrl = product.photo.includes('https:') ? product.photo : 'https:' + product.photo;
    image.src = imageUrl;
    image.classList.add('imgPrdt');
    productDiv.appendChild(image);

    productsDiv.appendChild(productDiv);
  }

  sectionProducts.innerHTML = '<span class="title-pattern">Products</span>';
  sectionProducts.appendChild(productsDiv);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {length: pageCount},
    (_, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  
  selectPage.innerHTML = options;
  selectPage.value = currentPage.toString();
};


/**
 * Render page selector
 * @param  {Object} pagination
 */

const compute_pk = k => {
  const sortedProducts = [...filtered_products].sort((a, b) => a.price - b.price);
  const index = Math.trunc(k / 100 * sortedProducts.length);
  return sortedProducts[index]?.price || 0;
};


 const renderIndicators = pagination => {
  try {
    if (filtered_products.length > 0) {
      const p50Price = compute_pk(50);
      const p90Price = compute_pk(90);
      const p95Price = compute_pk(95);
      const lastReleaseDate = [...filtered_products].sort((a, b) => sort_date(a, b, -1))[0].released;
      const nbNewProducts = filtered_products.reduce((total, x) => total + (Math.trunc((Date.now() - Date.parse(x.released)) / (1000 * 3600 * 24)) < 2 * 7 ? 1 : 0), 0);
      const nbProducts = filtered_products.length;

      priceP50.innerHTML = `${p50Price} €`;
      priceP90.innerHTML = `${p90Price} €`;
      priceP95.innerHTML = `${p95Price} €`;
      spanLastRelease.innerHTML = lastReleaseDate;
      spanNbNewProducts.innerHTML = nbNewProducts;
      spanNbProducts.innerHTML = nbProducts;
    } else {
      priceP50.innerHTML = 0;
      priceP90.innerHTML = 0;
      priceP95.innerHTML = 0;
      spanLastRelease.innerHTML = '----';
      spanNbNewProducts.innerHTML = 0;
      spanNbProducts.innerHTML = 0;
    }
  } catch (error) {
    console.error(error);
  }
};

const render = (products, pagination) => {
  try {
    renderProducts(products);
    renderPagination(pagination);
    renderIndicators(pagination);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', async event => {
  const pageSize = parseInt(event.target.value);
  try {
    const newProducts = await fetchProducts(currentPagination.currentPage, pageSize);
    setCurrentProducts(newProducts);
    currentPagination.pageSize = pageSize;
    render(filtered_products, currentPagination);
  } catch (error) {
    console.error(error);
  }
});

// Feature 1 Browse pages

selectPage.addEventListener('change', async event => {
  const page = parseInt(event.target.value);
  try {
    const newProducts = await fetchProducts(page, currentPagination.pageSize);
    setCurrentProducts(newProducts);
    render(filtered_products, currentPagination);
  } catch (error) {
    console.error(error);
  }
});


// Feature 2 brand selection

selectBrand.addEventListener('change', event => {
  const selectedBrand = event.target.value;
  brand_filter = x => selectedBrand === 'all' || x.brand === selectedBrand;
  filtered_products = apply_all_filters(currentProducts);
  render(filtered_products, currentPagination);
});

// Feature 3 date selection

recentlyReleased.addEventListener('change', function() {
  recent_filter = this.checked ? x => Math.trunc((Date.now() - Date.parse(x.released)) / (1000 * 3600 * 24)) < 14 : x => true;
  filtered_products = apply_all_filters(currentProducts);
  render(filtered_products, currentPagination);
});


// Feature 4 price selection

reasonablePrice.addEventListener('change', function() {
  reasonable_filter = this.checked ? x => x.price <= 50 : x => true;
  filtered_products = apply_all_filters(currentProducts);
  render(filtered_products, currentPagination);
});

// Feature 5-6 price selection

function sortByPrice(a, b, order) {
  if (a.price < b.price) {
    return -order;
  }
  if (a.price > b.price) {
    return order;
  }
  return 0;
}

function sortByDate(a, b, order) {
  const dateA = new Date(a.released);
  const dateB = new Date(b.released);
  if (dateA < dateB) {
    return -order;
  }
  if (dateA > dateB) {
    return order;
  }
  return 0;
}

function handleSortChange(event) {
  switch (event.target.value) {
    case "price-desc":
      currentProducts = [...currentProducts].sort((a, b) => sort_price(a, b, -1));
      break;
    case "price-asc":
      currentProducts = [...currentProducts].sort((a, b) => sort_price(a, b, 1));
      break;
    case "date-desc":
      currentProducts = [...currentProducts].sort((a, b) => sort_date(a, b, 1));
      break;
    case "date-asc":
      currentProducts = [...currentProducts].sort((a, b) => sort_date(a, b, -1));
      break;
  }

  filtered_products = apply_all_filters(currentProducts);
  render(filtered_products, currentPagination);
}

selectSort.addEventListener("change", handleSortChange);



//---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await fetchProducts();
    setCurrentProducts(products);
    render(filtered_products, currentPagination);
  } catch (error) {
    console.error(error);
  }
});
