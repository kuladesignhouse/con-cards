(function () {
  const getCards = async () => {
    const endpoint = 'https://concards.myshopify.com/api/2020-07/graphql';
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': '75af2f54e0d6eb2037bc91a0f90fa6db'
    });
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: `
        {
          collectionByHandle(handle: "Cards") {
            products(first: 250) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  tags
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
                }
              }
            }
          }
        }`
      })
    });
    const data = await response.json();
    handleCards(data.data)
  }
  let cards_row = document.querySelectorAll("section.card-store .center-row")[1];
  const handleCards = (data) => {
    for (var i = 0; i < data.collectionByHandle.products.edges.length; i++){
      let card_html = `
      <a href="${data.collectionByHandle.products.edges[i].node.handle}-card.html" class="card">
        <div class="card-imgs-wrap">
          <div class="card-imgs">
            <img src="../img/shadow.png">
            <img src="${data.collectionByHandle.products.edges[i].node.variants.edges[0].node.image.originalSrc}" class="product-overlay">
          </div>
        </div>
        <div class="card-info">
          <h3>${data.collectionByHandle.products.edges[i].node.title}</h3>
          <h3>${data.collectionByHandle.products.edges[i].node.description}</h3>
          <h3>$${data.collectionByHandle.products.edges[i].node.variants.edges[0].node.price}</h3>        
        </div>
      </a>`;
      cards_row.insertAdjacentHTML('beforeend', card_html);
    }
  }
  getCards();
})();