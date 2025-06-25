const spaceId = 'cu1o2r2yn7ax';
const accessToken = 'CT8ghEwdplU8TbYPQaeYKUQmF07yMEbGSVA_Ws7NLbg';

// Content types para Contentful
const productContentType = 'product';  // Para headphones.html
const homeContentType = 'homePage';    // Para index.html
console.log("¡scripts.js se ha cargado!");
// --- Función para cargar productos (NO TOCAR, es para headphones.html) ---
async function fetchProducts() {
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=${productContentType}&include=1`;

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
      const onSale = fields.onSale;
      const imageId = fields.image?.sys?.id;
      const imageAsset = data.includes?.Asset.find(asset => asset.sys.id === imageId);
      const imageUrl = imageAsset ? imageAsset.fields.file.url : '';

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
    console.error('Error fetching products:', error);
  }
}

// --- Función para cargar contenido del homepage (index.html) ---
async function fetchHomepageContent() {
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=${homeContentType}&include=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items.length) {
      console.error('No se encontró contenido para la homepage');
      return;
    }

    const entry = data.items[0].fields;
    console.log("Campos de la entrada de la homepage (todos):", entry);


    // Hero: título y subtítulo
    document.getElementById('hero-title').textContent = entry.heroTitle || 'Bienvenido a Tech Store';
    document.getElementById('hero-subtitle').textContent = entry.heroSubtitle || 'Tu tienda online de tecnología de confianza';

    // Si tienes imagen para hero
    if (entry.heroImage?.sys?.id) {
      const imageId = entry.heroImage.sys.id;
      const imageAsset = data.includes.Asset.find(asset => asset.sys.id === imageId);
      if (imageAsset) {
        document.querySelector('.hero').style.backgroundImage = `url(https:${imageAsset.fields.file.url})`;
      }
    }

    // Section 1 = headphones
    document.getElementById('headphones-title').textContent = entry.section1title || 'Headphones';
    document.getElementById('headphones-description').textContent = entry.section1text || 'Explora nuestra selección premium de auriculares inalámbricos y con cancelación de ruido.';
    const headphonesBtn = document.getElementById('headphones-button');
    headphonesBtn.textContent = entry.section1buttonText || 'Ver Headphones';
    headphonesBtn.href = entry.section1buttonurl || 'headphones.html';
    

  } catch (error) {
    console.error('Error cargando contenido homepage:', error);
  }
}

// --- Función para extraer texto plano de rich text ---
function extractPlainText(richText) {
  if (!richText || !richText.content) return '';
  return richText.content.map(block => {
    if(block.nodeType === 'paragraph' && block.content) {
      return block.content.map(c => c.value).join('');
    }
    return '';
  }).join('\n');
}

// --- Eventos para cerrar modal de imagen (productos) ---
const modalCloseBtn = document.getElementById('modal-close');
if(modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'none';
  });
}

const imageModal = document.getElementById('image-modal');
if(imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
    }
  });
}

// --- EJECUCIÓN ---
// Solo carga homepage content en index.html
if(document.querySelector('.hero')) {
  fetchHomepageContent();
}

// Solo carga productos si existe el contenedor (en headphones.html)
if(document.getElementById('products-container')) {
  fetchProducts();
}
