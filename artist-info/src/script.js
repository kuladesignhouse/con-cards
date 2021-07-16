var client = ShopifyBuy.buildClient({
  apiKey: 'bf081e860bc9dc1ce0654fdfbc20892d',
  domain: 'embeds.myshopify.com',
  appId: '6'
});

var ui = ShopifyBuy.UI.init(client);

ui.createComponent('product', {
  id: 3615122115,
  node: document.getElementById('product'),
  options: {
    product: {
      buttonDestination: 'checkout',
      contents: {
        img: false,
        title: false,
        options: false,
        price: false
      },
      templates: {
        button: '<button class="{{data.classes.product.button}} {{data.buttonClass}}">' +
          '{{data.buttonText}}' +
          '<span class="{{data.classes.product.prices}}">' +
            '<span class="{{data.classes.product.compareAt}}">{{data.formattedCompareAtPrice}}</span>' +
            '<span class="{{data.classes.product.price}}">{{data.formattedPrice}}</span>' +
          '</span>' +
        '</button>'
      },
      text: {
        button: 'Buy Now' 
      },
      styles: {
        product: {
          'text-align': 'left'
        },
        prices: {
          'display': 'inline-block',
          'margin-bottom': 0,
          'margin-left': '10px',
          'padding-left': '10px',
          'border-left': '1px solid white'
        },
        price: {
          'color': 'white',
          'display': 'inline-block',
          'padding-left': '8px'
        },
        compareAt: {
          'display': 'inline-block',
          'color': 'white'
        },
        button: {
          'background-color': '#1abc9c',
          'border-radius': 0,
          'padding': '12px 18px',
          'margin': '0 0 10px 0!important',
          'box-shadow': '3px 3px 0 #16a085',
          ':hover': {
            'background-color': '#3498db',
            'box-shadow': '3px 3px 0 #2980b9',
          },
          ':focus': {
            'background-color': '#3498db',
            'box-shadow': '3px 3px 0 #2980b9',
          }
        }
      }
    }
  }
});

            
