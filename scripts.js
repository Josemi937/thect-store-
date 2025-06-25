
const spaceId = 'cu1o2r2yn7ax';
const accessToken = 'CT8ghEwdplU8TbYPQaeYKUQmF07yMEbGSVA_Ws7NLbg';
const contentType = 'product';

async function fetchProducts() {
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=${contentType}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const container = document.getElementById('products-container');
    if (!container) {
      console.error("No se encontró el contenedor 'products-container'");
      return;
    }
    container.innerHTML = '';

    data.items.forEach(item => {
      const fields = item.fields;

      
      const title = fields.name || 'No title';
      const description = fields.description ? extractPlainText(fields.description) : 'No description';
      const price = fields.price !== undefined ? fields.price : '';
      const onSale = fields['onSale']; 
      const imageId = fields.image?.sys?.id;
      const imageAsset = data.includes?.Asset.find(asset => asset.sys.id === imageId);
      const imageUrl = imageAsset ? imageAsset.fields.file.url : '';

      const saleText = onSale ? '<span class="sale">On Sale!</span>' : '';

     
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <img src="https:${imageUrl}" alt="${title}" />
        <div class="product-body">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="price">${price}£</div>
        </div>
      `;
      card.addEventListener('click', () => {
        if (imageUrl) {
          const modal = document.getElementById('image-modal');
          const modalImg = document.getElementById('modal-img');
          modal.style.display = 'block';
          modalImg.src = `https:${imageUrl}`;
          modalImg.alt = title;
        }
      });
      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


function extractPlainText(richText) {
  if (!richText || !richText.content) return '';
  return richText.content.map(block => {
    if(block.nodeType === 'paragraph' && block.content) {
      return block.content.map(c => c.value).join('');
    }
    return '';
  }).join('\n');
}

fetchProducts();
document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'none';
  });
  
  document.getElementById('image-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('image-modal')) {
      document.getElementById('image-modal').style.display = 'none';
    }
  });
  