import "./styles.css";

//URL
const url =
  "http://search.unbxd.io/fb853e3332f2645fac9d71dc63e09ec1/demo-unbxd700181503576558/search?&q=";

const articleNode = document.querySelector("article");
const headerNode = document.querySelector("header");
const productSearchResultNode = document.querySelector(
  ".product-search-result"
);
const facetbarNode = document.querySelector(".facet-bar");

const inputBox = document.querySelector(".input-box");
const bannerBox = document.querySelector(".banner-img");
const filterResponsive = document.querySelector(".filter-responsive");

let products = {},
  numberOfProducts = 0;
let facets = {};
let banner = {};
let productCountString = "";

//Call the search API with the search query
const getProducts = (search) => {
  //Empty the articleNode first
  while (articleNode.firstChild) {
    articleNode.removeChild(articleNode.firstChild);
  }
  //Empty the facetbarNode now
  while (facetbarNode.firstChild) {
    facetbarNode.removeChild(facetbarNode.firstChild);
  }
  fetch(`${url}${search}`)
    .then((response) => response.json())
    .then((data) => {
      products = data.response.products;
      numberOfProducts = data.response.numberOfProducts;
      facets = data.facets;
      banner = data.banner ? data.banner : {};

      productCountString = search == "*" ? "" : `${search} - `;
      productCountString += `${numberOfProducts} items`;

      productSearchResultNode.innerText = productCountString;

      handleProducts(products);
      handleBanner(banner);
      handleFacets(facets);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleBanner = (banner) => {
  if (!banner.banners) {
    headerNode.classList.add("no-display");
  } else {
    headerNode.classList.remove("no-display");
    bannerBox.src = banner.banners[0].imageUrl;
  }
};

//Traverse over the products array
const handleProducts = (products) => {
  products.forEach((item) => {
    const productBlock = document.createElement("div");
    productBlock.classList.add("product-info");

    const img = document.createElement("img");
    img.classList.add("product-img");
    img.src = item.productImage;
    productBlock.appendChild(img);

    const desc = document.createElement("p");
    desc.classList.add("img-desc");
    desc.innerHTML = item.name;
    productBlock.appendChild(desc);

    const price = document.createElement("p");
    price.classList.add("price");
    price.innerHTML = item.price;
    productBlock.appendChild(price);

    productBlock.addEventListener("click", () => {
      let product_url = "http://demo-unbxd.unbxdapi.com/product?pid=";
      window.open(`${product_url}${item.sku}`, "_blank");
    });
    articleNode.appendChild(productBlock);
  });
};

const handleFacets = (facets) => {
  //   debugger;
  for (let facet in facets) {
    const facetBlock = document.createElement("div");
    facetBlock.classList.add("facetBlock");
    const facetName = document.createElement("p");
    const facetInfo = document.createElement("div");

    const name = facets[facet].displayName;
    facetName.innerText = name;
    facetName.classList.add("facetName");
    facetBlock.appendChild(facetName);

    let temp = facets[facet].values;
    let facetValues = {};
    for (let i = 0; i + 1 < temp.length; i += 2) {
      facetValues[temp[i]] = temp[i + 1];
    }
    //Iterate over facetValues now
    for (let value in facetValues) {
      const levelDiv = document.createElement("div");
      levelDiv.classList.add("facetLevelDiv");
      const facetInput = document.createElement("input");
      facetInput.type = "checkbox";
      facetInput.name = value;
      facetInput.value = value;

      const facetLabel = document.createElement("Label");
      facetLabel.setAttribute = ("for", value);
      facetLabel.innerText = `${value} - (${facetValues[value]})`;

      levelDiv.appendChild(facetInput);
      levelDiv.appendChild(facetLabel);
      facetInfo.appendChild(levelDiv);
    }
    facetBlock.appendChild(facetInfo);
    facetbarNode.appendChild(facetBlock);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getProducts("*");
});
inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    // console.log(inputBox.value);
    if (inputBox.value) {
      getProducts(inputBox.value);
    } else {
      getProducts("*");
    }
  }
});
let counter = 0;
filterResponsive.addEventListener("click", () => {
  counter += 1;
  if (counter % 2 == 0) {
    facetbarNode.style.display = "none";
  } else {
    facetbarNode.style.display = "block";
  }
});
