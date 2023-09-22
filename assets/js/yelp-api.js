// Get the necessary HTML elements
const locationInput = document.getElementById('locationInput');
const cuisineInput = document.getElementById('cuisineInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');

// Add an event listener to the search button
searchButton.addEventListener('click', () => {
  const location = locationInput.value.trim();
  const cuisine = cuisineInput.value.trim();

  if (location !== '' && cuisine !== '') {
    // Clear previous search results
    resultsContainer.innerHTML = '';

    // Call the Yelp API function and pass the user input
    fetchYelpData(location, cuisine)
      .then(data => {
        // Handle the response data
        displayResults(data.businesses);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }
});

// Function to fetch data from Yelp API
async function fetchYelpData(location, cuisine) {
  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.append('term', cuisine);
  url.searchParams.append('location', location);
  
  const headers = new Headers({
    'Authorization': `Bearer L7g3gvxjIcxAgmvNhhiIsVfj_FKUSYsMm7nVhlrpqOyr7YOXdLyJ14-U9txhR8bki8PA2PqJ8C_vzy5lS_7ZP3hEwq8lG-MKytyKCm_Kzx31n0ytkK7lsfqeoAYJZXYx`, // Insert your API Key here
    'Content-Type': 'application/json',
    'x-request-id': 'g2rBoeC8e8JEvnoypxmbjw', // Insert  !!!Client ID here!!!!!!
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

// Function to display search results
function displayResults(businesses) {
  businesses.forEach(business => {
    const resultItem = createResultItem(business);
    resultsContainer.appendChild(resultItem);
  });
}

// Function to create a single result item
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