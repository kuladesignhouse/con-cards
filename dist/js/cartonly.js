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
  
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'concards.myshopify.com',
      storefrontAccessToken: access_token,
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('cart', {
        id: '6804354105523',
        node: document.getElementById('product'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {

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
    });
  }
})();