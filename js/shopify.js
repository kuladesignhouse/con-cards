let firstLoop = true;
(function () {
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
    var d = document.querySelector(".shopify-buy__product-description")
    if (!d){
      setTimeout(artistInfo,100);
    } else {
      data = JSON.parse(d.dataset.data);
      let artist_info_html = 
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
              <div>${data['artist-name-full']}</div>
              <div>${data['term']}</div>
              <div>${data['outdate']}</div>
              <div>${data['location']}</div>
              <div>"${data['parting-shot']}"</div>
            </div>
          </div>`;
      document.getElementById('artist-info').innerHTML = artist_info_html;
      let more_by_html = `<h4>More By ${data['artist-name-full']}</h4>`;
      document.getElementById('more-by').innerHTML = more_by_html;
      getMoreBy(data['artist-name-full']);
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
    const endpoint = 'https://concards.myshopify.com/api/2020-07/graphql';
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
              }
            }
          }
        }`
      })
    });
    const data = await response.json();
    moreBy(data.data, artist_name)
  }
  
  const moreBy = (data, artist_name) => {
    var more_by_wrap = document.createElement("DIV");
    for (var i = 0; i < data.products.edges.length; i++){
      var link = document.createElement("A");
      link.href = `${data.products.edges[i].node.handle}.html`;
      var img = document.createElement("IMG");
      img.src = data.products.edges[i].node.variants.edges[0].node.image.originalSrc;
      link.appendChild(img);
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
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'concards.myshopify.com',
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
    "contents": {
      "img": false,
      "imgWithCarousel": true,
      "description": true
    },
    "width": "100%",
    "text": {
      "button": "Add to cart"
    },
    "templates" : {
      "description": '<div class="{{data.classes.product.description}}" data-data="{{data.description}}"></div>',
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
          '<p class="{{data.classes.option.label}}">Shirt {{data.name}}</p>' +
          '<div>' +
            '{{#data.values}}' +
            '<button {{#data.styleAttr}} {{name}} {{/data.styleAttr}} data-value="{{name}}" data-option={{data.name}} class="{{#disabled}}{{data.classes.option.optionDisabled}}{{/disabled}} {{#selected}}{{data.classes.option.optionSelected}}{{/selected}} {{data.classes.option.option}}" id="btn{{name}}">{{#data.optionName}}{{name}}{{/data.optionName}}</button>' +
            '{{/data.values}}' +
          '</div>' +
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