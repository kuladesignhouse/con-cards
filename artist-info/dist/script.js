var client = ShopifyBuy.buildClient({
  storefrontAccessToken: '75af2f54e0d6eb2037bc91a0f90fa6db',
  domain: 'concards.myshopify.com'
});

var ui = ShopifyBuy.UI.init(client);

ui.createComponent('product', {
  id: 6731960582323,
  node: document.getElementById('product'),
  options: {
    product: {
      buttonDestination: 'checkout',
      contents: {
        img: false,
        title: false,
        options: false,
        price: false,
        description: true
      },
      iframe: false,
      templates: {
        button: '<button class="{{data.classes.product.button}} {{data.buttonClass}}">' +
          '{{data.buttonText}}' +
          '<span class="{{data.classes.product.prices}}">' +
            '<span class="{{data.classes.product.compareAt}}">{{data.formattedCompareAtPrice}}</span>' +
            '<span class="{{data.classes.product.price}}">{{data.formattedPrice}}</span>' +
          '</span>' +
        '</button>',
        description: '<div class="{{data.classes.product.description}}" data-data="{{data.description}}"></div>',
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


function wait(){
  var d = document.querySelector(".shopify-buy__product-description")
  if (!d){
    setTimeout(wait,100);
  } else {
    data = JSON.parse(d.dataset.data);
    //console.log(data);
    let html = 
       `<div class="artist-info">
          <h4>Arist Info</h4>
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
          </div>
        </div>`;
    
    //d.innerHTML = html;
    document.getElementById('product').insertAdjacentHTML('beforeend', html);
  }
}

wait();

