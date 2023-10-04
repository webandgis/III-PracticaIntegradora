fetch('http://localhost:8007/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productContainer = document.querySelector('#product-container');
    data.producto.forEach((product) => {
      const productItem = document.createElement('li');
      productItem.innerHTML = `${product.name}, ${product.category}, ${product.price}, ${product.stock}`;
      
      const buyButton = document.createElement('button');
      buyButton.innerText = 'Comprar';
      
      productItem.appendChild(buyButton);
      productContainer.appendChild(productItem);
    });
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });