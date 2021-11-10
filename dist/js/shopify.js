let firstLoop = true;
var modal = document.getElementById("sizeModal");
function openSizeModal() {
  modal.style.display = "flex";
}
function closeSizeModal() {
  modal.style.display = "none";
}
(function () {
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  const access_token = "75af2f54e0d6eb2037bc91a0f90fa6db";
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function artistInfo(){
    var d = document.querySelector(".shopify-buy__product-description");
    if (!d){
      setTimeout(artistInfo,100);
    } else {
      var artist_info_html = "";
      var more_by_html = "";
      var artist_fullname = "";
      var description = d.dataset.data;
      var data;
      try {
        data = JSON.parse(d.dataset.data);
        var artist_name_formatted = data['artist_fullname'].replace('\\"', '"').replace('\\\"', '"');
/*
        artist_info_html = 
           `<h4>Arist Info</h4>
            <div>
              <div>
                <div>Name:</div>
                <div>Term:</div>
                <div>Outdate:</div>
                <div>Location:</div>
                <div>Parting Shot:</div>
              </div>
              <div>        
                <div>${artist_name_formatted}</div>
                <div>${data['term']}</div>
                <div>${data['outdate']}</div>
                <div>${data['location']}</div>
                <div>${data['parting_shot']}  </div>
              </div>
            </div>`;
*/
        artist_info_html = 
           `<h4>Arist Info</h4>
            <div>
              <div>
                <div>Name:</div>
                <div>${artist_name_formatted}</div>
              </div>
              <div>
                <div>Term:</div>
                <div>${data['term']}</div>
              </div>
              <div>
                <div>Outdate:</div>
                <div>${data['outdate']}</div>
              </div>
              <div>
                <div>Location:</div>
                <div>${data['location']}</div>
              </div>
              <div>
                <div>Parting Shot:</div>
                <div>${data['parting_shot']}  </div>
              </div>
            </div>`;
        more_by_html = `<h4>More By ${artist_name_formatted}</h4>`;
        artist_fullname = data['artist_fullname'];
      } catch(e) {
        artist_fullname = d.dataset.data;
        artist_info_html = 
           `<h4>Arist Info</h4>
            <div>
              <div>
                <div>Name:</div>
                <div>Term:</div>
                <div>Outdate:</div>
                <div>Location:</div>
                <div>Parting Shot:</div>
              </div>
              <div>        
                <div>${artist_fullname}</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>`;
        more_by_html = `<h4>More By ${artist_fullname}</h4>`;
      }
      document.getElementById('artist-info').innerHTML = artist_info_html;
      document.getElementById('more-by').innerHTML = more_by_html;
      getMoreBy(artist_fullname);
    }
  }
  let cartCount = document.getElementById("cart-count");
  function getCount(lineItems) {
    
    let count = 0;
    for (i=0; i<lineItems.length;i++) {
      count += lineItems[i].quantity;
    }
    if (count > 9) {
      if (!cartCount.classList.contains("dbldgts")) {
        cartCount.classList.add("dbldgts");
      }
    } else {
      if (cartCount.classList.contains("dbldgts")) {
        cartCount.classList.remove("dbldgts");
      }
    }
    return count;
  }
  const getMoreBy = async (artist_name) => {
    const endpoint = 'https://checkout.concardsco.com/api/2020-07/graphql';
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': access_token
    });
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: `
        {
          products(first: 3, query:"tag:${artist_name}") {
            edges {
              node {
                variants(first: 1) {
                  edges {
                    node {
                      image {
                        id
                        originalSrc
                      }
                      price
                    }
                  }
                }
                id
                title
                handle
                productType
                images(first: 1) {
        	        edges {
        	          node {
        	            id
        	            originalSrc
        	          }
        	        }
        	      }
              }
            }
          }
        }`
      })
    });
    const data = await response.json();
    moreBy(
      data.data,
      artist_name.replace('\\"', '"').replace('\\\"', '"')
    )
  }
  
  const moreBy = (data, artist_name) => {
    if (data && "products" in data) {
      var more_by_wrap = document.createElement("DIV");
      for (var i = 0; i < data.products.edges.length; i++){
        var link = document.createElement("A");
        var img = document.createElement("IMG");
        var img_wrap = document.createElement("DIV");
        img_wrap.className = "img-zoom-wrap";
        if (data.products.edges[i].node.productType == "card") {
          img_wrap.classList.add("img-zoom-wrap-card");
          link.href = `${data.products.edges[i].node.handle}-card.html`;
          img.src = data.products.edges[i].node.variants.edges[0].node.image.originalSrc;
          img.className = "product-overlay";
          var card_imgs = document.createElement("DIV");
          card_imgs.className = "cardimg";
          var shadow_img = document.createElement("IMG");
          shadow_img.src = "img/shadow.png";
          shadow_img.className = "shadow-img";
          card_imgs.appendChild(shadow_img);
          card_imgs.appendChild(img);
          //img_wrap.appendChild(shadow_img);
          //img_wrap.appendChild(img);
          img_wrap.appendChild(card_imgs);
  
        } else {
          link.href = `${data.products.edges[i].node.handle}.html`;
          img.src = data.products.edges[i].node.images.edges[0].node.originalSrc;
          img.className = "zoom-shirt";
          img_wrap.appendChild(img);
        }
        link.appendChild(img_wrap);
        var item_info = document.createElement("DIV");
        item_info.className = "item-info";
        var item_title = document.createElement("DIV");
        item_title.textContent = data.products.edges[i].node.title;
        var item_artist = document.createElement("DIV");
        item_artist.textContent = artist_name;
        var item_price = document.createElement("DIV");
        item_price.textContent = data.products.edges[i].node.variants.edges[0].node.price;
        item_info.appendChild(item_title);
        item_info.appendChild(item_artist);
        item_info.appendChild(item_price);
        link.appendChild(item_info);
        more_by_wrap.appendChild(link); 
      }
      document.getElementById('more-by').appendChild(more_by_wrap);
    }
  }
  var contents = {
    "img": false,
    "imgWithCarousel": true,
    "description": true
  };
  if (is_card == true) {
    contents = {
      "img": true,
      "imgWithCarousel": false,
      "description": true
    };
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'checkout.concardsco.com',
      storefrontAccessToken: access_token,
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: product_id,
        node: document.getElementById('product'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
  "product": {

    "events": {
      "addVariantToCart": function (component) {
        const countItems = async ()=>{
          let lineItems = await component.cart.model;
          var count = 0;
          if (lineItems != null) {
            lineItems = lineItems.lineItems;
            for (var i=0; i<lineItems.length;i++) {
              if ("quantity" in lineItems[i]) {
                count += lineItems[i].quantity;
              }
            }
          } else {
            count += 1; //model doesn't exist
          }
          return count;
        }
        countItems().then(count => {
          if (count == 0) {
            if (cartCount.classList.contains("notempty")) {
              cartCount.classList.remove("notempty");
            }
          } else  {
            if (!cartCount.classList.contains("notempty")) {
              cartCount.classList.add("notempty");
            }
          }
          if (count > 9) {
            if (!cartCount.classList.contains("dbldgts")) {
              cartCount.classList.add("dbldgts");
            }
          } else {
            if (cartCount.classList.contains("dbldgts")) {
              cartCount.classList.remove("dbldgts");
            }
          }
        });
      },
    },

    "iframe": false,
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0",
          "margin-bottom": "50px"
        },
        "text-align": "left"
      },
      "title": {
        "font-size": "26px"
      },
      "price": {
        "font-size": "18px"
      },
      "compareAt": {
        "font-size": "15.299999999999999px"
      },
      "unitPrice": {
        "font-size": "15.299999999999999px"
      }
    },
    "layout": "horizontal",
    "contents": contents,
    "width": "100%",
    "text": {
      "button": "Add to cart"
    },
    "templates" : {
      "description": '<div class="{{data.classes.product.description}}" data-data="{{data.description}}"></div>',
      "img" : '{{#data.currentImage.srcLarge}}<div class="card-img"><img src="img/shadow.png"><img alt="{{data.currentImage.altText}}" src="{{data.currentImage.srcLarge}}" /></div>{{/data.currentImage.srcLarge}}',
    },
    "DOMEvents": {
      'click .shopify-buy__option-select': function (evt, target) {
        var data = target.dataset;
        var product = ui.components.product[0];
        product.updateVariant(data.option, data.value);
      }
    },
  },
  "productSet": {
    "iframe": false,
    "styles": {
      "products": {
        "@media (min-width: 601px)": {
          "margin-left": "-20px"
        }
      }
    }
  },
  "modalProduct": {
    "iframe": false,
    "contents": {
      "img": false,
      "imgWithCarousel": true,
      "button": false,
      "buttonWithQuantity": true
    },
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px"
        }
      },
      "title": {
        "font-family": "Helvetica Neue, sans-serif",
        "font-weight": "bold",
        "font-size": "26px",
        "color": "#4c4c4c"
      },
      "price": {
        "font-family": "Helvetica Neue, sans-serif",
        "font-weight": "normal",
        "font-size": "18px",
        "color": "#4c4c4c"
      },
      "compareAt": {
        "font-family": "Helvetica Neue, sans-serif",
        "font-weight": "normal",
        "font-size": "15.299999999999999px",
        "color": "#4c4c4c"
      },
      "unitPrice": {
        "font-family": "Helvetica Neue, sans-serif",
        "font-weight": "normal",
        "font-size": "15.299999999999999px",
        "color": "#4c4c4c"
      }
    },
    "text": {
      "button": "Add to cart"
    }
  },
  "option": {
    "iframe": false,
    "templates": {
      "option": '' +
        '<div class="{{data.classes.option.wrapper}}">' +
          '<p class="{{data.classes.option.label}}">Shirt {{data.name}}<span class="size-warning">(<span>Sizes run small</span> - <span>order a size up if you like a relaxed fit</span>)</span></p>' +
          '<div>' +
            '{{#data.values}}' +
            '<button {{#data.styleAttr}} {{name}} {{/data.styleAttr}} data-value="{{name}}" data-option={{data.name}} class="{{#disabled}}{{data.classes.option.optionDisabled}}{{/disabled}} {{#selected}}{{data.classes.option.optionSelected}}{{/selected}} {{data.classes.option.option}}" id="btn{{name}}">{{#data.optionName}}{{name}}{{/data.optionName}}</button>' +
            '{{/data.values}}' +
          '</div>' +
          '<p id="sizing-link" onclick="openSizeModal()" style="text-decoration: underline;">View Sizing Chart</h1>' +
        '</div>',
    },
    "styles": {
      "wrapper": {
        'padding-bottom': '10px',
        'border': 0,
      },
      "label": {
        'margin-top': '0'
      },
      "option": {
        'border': '1px solid #c7c2c0',
        'display': 'inline-block',
        'margin-top': '0!important',
        'margin-right': '5px',
        'background-color': '#fff',
        'height': '45px',
        'width': '45px',
        'cursor': 'pointer',
        'font-weight': 'bold',
        'border-radius': '4px',
      },
      "optionDisabled": {
        'opacity': '0.2',
        'position': 'relative',
        ':before': {
          'content': '""',
          'position': 'absolute',
          'height': '60px',
          'width': '1px',
          'background': 'black',
          'top': '-8px',
          'left': '21px',
          'transform': 'rotate(45deg)'
        }
      },
      "optionSelected": {
        'border-color': 'black'
      }
    },

  },
  "cart": {
    "iframe": false,
    "text": {
      "total": "Subtotal",
      "button": "Checkout"
    },
    "popup": false,
    "events": {
      "updateItemQuantity": function (component) {
        async function getUpdatedQty(prevCount){
          let count = getCount(component.model.lineItems);
          while(count == prevCount) {
            count = getCount(component.model.lineItems);
            await new Promise(r => setTimeout(r, 200));
          }
          if (count == 0) {
            if (cartCount.classList.contains("notempty")) {
              cartCount.classList.remove("notempty");
            }
          } else  {
            if (!cartCount.classList.contains("notempty")) {
              cartCount.classList.add("notempty");
            }
          }
          return count;
        };
        var prevCount = getCount(component.model.lineItems);
        getUpdatedQty(prevCount).then(value => {
          //console.log(`Updated qty ${value}`);
        }, reason => {
          console.error(reason); // Error!
        });
      },
    },
  },
  "toggle": {
    "iframe": false,
    "contents": {
      "count": true,
      "icon": false,
      "title": false
    },
    "styles": {
      "toggle": {
      'background-color': '#212121',
      ':hover': {
        'background-color': 'black'
      },
      ':focus': {
        'background-color': 'black'
      }
    }

    },
    "sticky": false,
    "events": {
      "beforeRender": function (component) {        
        if (firstLoop) {
          let count = getCount(component.model.lineItems);
          if (count > 0) {
            cartCount.classList.add("notempty");
          }
          cartCount.appendChild(component.node);            
        }
        firstLoop = false;
      },
    },
  }
},
      });
      document.getElementById("cart-wrap").addEventListener('click', event => {
        event.stopPropagation();
        ui.openCart();
      });
      artistInfo();
    });
  }
})();