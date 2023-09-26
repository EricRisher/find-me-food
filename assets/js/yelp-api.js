const locationInput = document.getElementById('locationInput');
const cuisineInput = document.getElementById('cuisineInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');

searchButton.addEventListener('click', () => {
  const location = locationInput.value.trim();
  const cuisine = cuisineInput.value.trim();

  if (location !== '' && cuisine !== '') {
    resultsContainer.innerHTML = '';

    fetchYelpData(location, cuisine)
      .then(data => {
        displayResults(data.businesses);
      })
      .catch(error => {
        console.error(error);
      });
  }
});

async function fetchYelpData(location, cuisine) {
  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.append('term', cuisine);
  url.searchParams.append('location', location);
  
  const headers = new Headers({
    'Authorization': `Bearer L7g3gvxjIcxAgmvNhhiIsVfj_FKUSYsMm7nVhlrpqOyr7YOXdLyJ14-U9txhR8bki8PA2PqJ8C_vzy5lS_7ZP3hEwq8lG-MKytyKCm_Kzx31n0ytkK7lsfqeoAYJZXYx`, // Insert your API Key here
    'Content-Type': 'application/json',
    'x-request-id': 'g2rBoeC8e8JEvnoypxmbjw', 
  });

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function displayResults(businesses) {
  businesses.forEach(business => {
    const resultItem = createResultItem(business);
    resultsContainer.appendChild(resultItem);
  });
}
async function viewMenu(restaurantId) {
  const url = new URL(`https://api.yelp.com/v3/businesses/${restaurantId}`);
  
  const headers = new Headers({
    'Authorization': `Bearer L7g3gvxjIcxAgmvNhhiIsVfj_FKUSYsMm7nVhlrpqOyr7YOXdLyJ14-U9txhR8bki8PA2PqJ8C_vzy5lS_7ZP3hEwq8lG-MKytyKCm_Kzx31n0ytkK7lsfqeoAYJZXYx`, // Insert your API Key here
    'Content-Type': 'application/json',
    'x-request-id': 'g2rBoeC8e8JEvnoypxmbjw', 
  });

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    displayMenu(data);
  } catch (error) {
    console.error('Error:', error);
  }
}


function createResultItem(business) {
  const box = document.createElement('div');
  box.className = 'box';
  
  const article = document.createElement('article');
  article.className = 'media';
  
  const mediaContent = document.createElement('div');
  mediaContent.className = 'media-content';
  
  const content = document.createElement('div');
  content.className = 'content';
  
  const name = document.createElement('p');
  name.innerHTML = `<strong>${business.name}</strong>`;
  
  const cuisine = document.createElement('span');
  cuisine.className = 'has-text-grey';
  cuisine.textContent = business.categories[0].title;

  const address = document.createElement('br');
  address.textContent = `Address: ${business.location.address1}, ${business.location.city}, ${business.location.state}`;

  content.appendChild(name);
  content.appendChild(cuisine);
  content.appendChild(address);

  mediaContent.appendChild(content);
  article.appendChild(mediaContent);
  box.appendChild(article);

  return box;
}

function displayMenu(data) {
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';

  const menuTitle = document.createElement('h2');
  menuTitle.textContent = 'Menu';

  const menuItems = data.menu ? data.menu.sections.map(section => section.title + ': ' + section.description).join('\n') : 'Menu not available';

  const menuContent = document.createElement('pre');
  menuContent.textContent = menuItems;

  menuContainer.appendChild(menuTitle);
  menuContainer.appendChild(menuContent);

  resultsContainer.appendChild(menuContainer);
}

const reviewForm = document.getElementById('reviewForm');
const reviewsContainer = document.getElementById('reviewsContainer');

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('nameInput').value.trim();
  const rating = document.getElementById('ratingInput').value.trim();
  const review = document.getElementById('reviewInput').value.trim();

  if (name !== '' && rating !== '' && review !== '') {
    const reviewItem = createReviewItem(name, rating, review);
    reviewsContainer.appendChild(reviewItem);

    // Clear the form inputs
    reviewForm.reset();
  }
});

function createReviewItem(name, rating, review) {
  const box = document.createElement('div');
  box.className = 'box';

  const article = document.createElement('article');
  article.className = 'media';

  const mediaContent = document.createElement('div');
  mediaContent.className = 'media-content';

  const content = document.createElement('div');
  content.className = 'content';

  const reviewTitle = document.createElement('p');
  reviewTitle.innerHTML = `<strong>${name}</strong>`;
  content.appendChild(reviewTitle);

  const ratingElement = document.createElement('span');
  ratingElement.className = 'has-text-grey';
  ratingElement.textContent = `Rating: ${rating}/5`;
  content.appendChild(ratingElement);

  const reviewText = document.createElement('p');
  reviewText.textContent = review;
  content.appendChild(reviewText);

  mediaContent.appendChild(content);
  article.appendChild(mediaContent);
  box.appendChild(article);

  return box;
}