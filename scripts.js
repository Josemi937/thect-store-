const spaceId = 'cu1o2r2yn7ax';
const accessToken = 'CT8ghEwdplU8TbYPQaeYKUQmF07yMEbGSVA_Ws7NLbg';

// Content types
const productContentType = 'product';   // para headphones.html
const laptopContentType = 'product2';   // para laptops.html
const homeContentType = 'homePage';     // para index.html

console.log("¡scripts.js se ha cargado!");

// Función para extraer texto plano de rich text (Contentful)
function extractPlainText(richText) {
  if (!richText || !richText.content) return '';
  return richText.content.map(block => {
    if(block.nodeType === 'paragraph' && block.content) {
      return block.content.map(c => c.value).join('');
    }
    return '';
  }).join('\n');
}


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

// --- Función para cargar productos laptops ---
async function fetchLaptops() {
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=${laptopContentType}&include=1`;

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
    console.error('Error fetching laptops:', error);
  }
}

// --- Función para cargar contenido homepage (index.html) ---
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

    // Imagen hero
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

    // Section 2 = laptops
    document.getElementById('laptops-title').textContent = entry.section2title || 'Laptops';
    document.getElementById('laptops-description').textContent = entry.section2text || 'Explora nuestra colección de laptops.';
    const laptopsBtn = document.getElementById('laptops-button');
    laptopsBtn.textContent = entry.section2buttonText || 'Ver Laptops';
    laptopsBtn.href = entry.section2buttonurl || 'laptops.html';

  } catch (error) {
    console.error('Error cargando contenido homepage:', error);
  }
}

// --- Eventos para cerrar modal de imagen ---
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
if(document.querySelector('.hero')) {
  fetchHomepageContent();
}

if(document.getElementById('products-container')) {
  // Detecta si estamos en headphones.html o laptops.html
  // Puedes hacer esto con una clase o id en el body, o con la url
  const path = window.location.pathname;
  if(path.includes('headphones.html')) {
    fetchProducts();
  } else if(path.includes('laptops.html')) {
    fetchLaptops();
  }
}
