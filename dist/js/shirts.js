(function () {
  const getShirts = async () => {
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
          collectionByHandle(handle: "Shirts") {
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
          }
        }`
      })
    });
    const data = await response.json();
    handleShirts(data.data)
  }
  let shirts_row = document.querySelectorAll("section.shirts .center-row")[1];
  const handleShirts = (data) => {
    for (var i = 0; i < data.collectionByHandle.products.edges.length; i++){
      var description = JSON.parse(data.collectionByHandle.products.edges[i].node.description);
      let shirt_html = `
      <a href="${data.collectionByHandle.products.edges[i].node.handle}.html" class="shirt">
        <div class="shirt-imgs-wrap">
          <div class="shirt-imgs">
            <img src="${data.collectionByHandle.products.edges[i].node.images.edges[0].node.originalSrc}" class="shirt-zoom">
          </div>
        </div>
        <div class="shirt-info">
          <h3>${data.collectionByHandle.products.edges[i].node.title}</h3>
          <h3>${description["artist_fullname"]}</h3>
          <h3>$${data.collectionByHandle.products.edges[i].node.variants.edges[0].node.price}</h3>        
        </div>
      </a>`;
      shirts_row.insertAdjacentHTML('beforeend', shirt_html);
    }
  }
  getShirts();
})();