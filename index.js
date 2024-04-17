const singlePokemonsContent = document.getElementById('pokemons-single-content');
const pokemonsContent = document.getElementById('pokemons-content');
const amount = document.getElementById('amount');

// Metod 1: Här hämstas enbart en enda instans av en pokemon och visar upp den

fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
  .then(response => response.json())
  .then(data => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.width = '18rem';


    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.alt = data.name;
    img.src = data.sprites.other['official-artwork'].front_default;
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = data.name;
    cardBody.appendChild(cardTitle);

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = `Base Experience: ${data.base_experience}`;
    cardBody.appendChild(cardText);

    card.appendChild(cardBody);


    const listGroup = document.createElement('ul');
    listGroup.className = 'list-group list-group-flush';

    data.stats.forEach(stat => {
      const statItem = document.createElement('li');
      statItem.className = 'list-group-item';
      statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
      listGroup.appendChild(statItem);
    });
    card.appendChild(listGroup);


    const cardBodyLinks = document.createElement('div');
    cardBodyLinks.className = 'card-body';

    const cardLink1 = document.createElement('a');
    cardLink1.href = 'https://www.pokemon.com/us/pokedex/pikachu';
    cardLink1.className = 'card-link';
    cardLink1.textContent = 'More about Pikachu';
    cardBodyLinks.appendChild(cardLink1);

    card.appendChild(cardBodyLinks);

    singlePokemonsContent.appendChild(card)
  })
  .catch(error => console.error('Fel med api-anrop):', error));


// Metod 2: Hämta en lista med de första 50 Pokémonerna, och dessutom skapas en knapp
// för att visa ytterligare information i en annan länk

fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
  .then(response => response.json())
  .then(data => {
    showContent(data.results);
    amount.innerHTML = `${data.count}`;
  })

  .catch(error => {
    console.error("Error message: The API can not be loaded.", error);
  });

/* en API-klient som till exempel Postman visar resultaten lite enklare se vad som exakt
   faktiskt returneras med https://pokeapi.co/api/v2/pokemon. Det är
   fyra nycklar: "count", "next", "previous" och "results". Alla dessa har egna värden
   och count används ovan (data.count) för att visa antal pokemons i just den url:en

   Det sista värdet, result, är en array som i sin tur enbart har två nycklar,
   "name" och "url". "name" används nedan. Men, för att nå vad som finns i 
   "url" (som ju är en ny länk) måste vi göra en ny förfrågan med fetch, och sen använda det innehållet
  */

   function showContent(pokemons) {
    const pokemonsContent = document.getElementById('pokemons-content');
    pokemonsContent.innerHTML = ''; // Rensa innehållet från tidigare förfrågningar
  
    pokemons.forEach(pokemon => {
      fetch(pokemon.url)
        .then(response => response.json())
        .then(details => {
          const pokemonImage = details.sprites.other['official-artwork'].front_default;
          const card = document.createElement('div');
          card.className = 'col-sm-6 col-md-4 col-lg-3';
          card.innerHTML = `
            <div class="card h-100">
              <img src="${pokemonImage}" class="card-img-top" alt="${pokemon.name}">
              <div class="card-body">
                <h5 class="card-title">${pokemon.name}</h5>
                <p class="card-text"></p>
              </div>
            </div>
          `;
  
          // Skapa och lägg till knappen i card-text elementet
          const cardText = card.querySelector('.card-text');
          const button = document.createElement('button');
          button.className = 'btn btn-primary';
          button.textContent = 'Mer info';
          // Sätt knappens eventlyssnare till att anropa fetchPokemonDetails när den klickas
          button.addEventListener('click', function() {
            fetchPokemonDetails(pokemon.url);
          });
          cardText.appendChild(button);
  
          // Lägg till hela kortet i pokemonsContent container
          pokemonsContent.appendChild(card);
        });
    });
  }
 
  function fetchPokemonDetails(url) {
    fetch(url)
      .then(response => response.json())
      .then(details => {

        console.log(details);

        const modalBody = document.querySelector('#pokemonModal .modal-body');
        modalBody.innerHTML = `
          <div class="text-center">
            <img src="${details.sprites.other['official-artwork'].front_default}" class="img-fluid" alt="${details.name}">
            <h5 class="mt-2">${details.name.toUpperCase()}</h5>
            <p>Height: ${details.height} | Weight: ${details.weight}</p>
            <!-- Lägg till mer information du vill visa här -->
          </div>
        `;
  
        const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
        pokemonModal.show();
      })
      .catch(error => {
        console.error('Error fetching details:', error);
      });
  }
  
