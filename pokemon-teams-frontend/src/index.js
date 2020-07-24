const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// create trainer cards
const fetchAllTrainers = () => {
    fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(json => json.forEach(trainer => buildOneTrainer(trainer)))
}

const buildOneTrainer = trainer => {
    let main = document.querySelector('main')
    let trainerDiv = document.createElement('div')
    trainerDiv.className = 'card'
    trainerDiv.id = `trainer-${trainer.id}`

    let trainerP = document.createElement('p')
    trainerP.innerText = trainer.name

    let addPokemonButton = document.createElement('button')
    addPokemonButton.innerText = 'Add Pokemon'
    addPokemonButton.setAttribute('data-trainer-id', trainer.id)
    addPokemonButton.addEventListener('click', () => fetchOneTrainer(trainer))

    let pokemonUl = document.createElement('ul')
    for (let pokemon of trainer.pokemons) {
        let li = document.createElement('li')
        li.innerText = `${pokemon.nickname} (${pokemon.species})`
        li.id = `pokemon-${pokemon.id}`

        let releasePokemonButton = document.createElement('button')
        releasePokemonButton.className = 'release'
        releasePokemonButton.innerText = 'Release'
        releasePokemonButton.setAttribute('data-pokemon-id', pokemon.id)
        releasePokemonButton.addEventListener('click', () => releasePokemon(pokemon))

        li.appendChild(releasePokemonButton)
        pokemonUl.appendChild(li)
    }

    trainerDiv.append(trainerP, addPokemonButton, pokemonUl)
    main.appendChild(trainerDiv)
}

// add pokemon to team
const addPokemonToTeam = (trainer) => {
    if (trainer.pokemons.length !== 6) {
        let newPokemon = {
            trainer_id: trainer.id
        }

        fetch(POKEMONS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPokemon)
        })
        .then(res => res.json())
        .then(json => {
            let trainerDiv = document.getElementById(`trainer-${trainer.id}`)
            let pokemonUl = trainerDiv.querySelector('ul')
            let li = document.createElement('li')
            li.id = `pokemon-${json.id}`
            li.innerText = `${json.nickname} (${json.species})`
    
            let releasePokemonButton = document.createElement('button')
            releasePokemonButton.className = 'release'
            releasePokemonButton.innerText = 'Release'
            releasePokemonButton.setAttribute('data-pokemon-id', json.id)
            releasePokemonButton.addEventListener('click', () => releasePokemon(json))

            li.appendChild(releasePokemonButton)
            pokemonUl.appendChild(li)
        })
    } else {
        alert('This team is full!')
    }
}

// fetch one trainer
const fetchOneTrainer = (trainer) => {
    fetch((TRAINERS_URL + `/${trainer.id}`))
    .then(res => res.json())
    .then(json => addPokemonToTeam(json))
}

// release pokemon
const releasePokemon = (pokemon) => {
    fetch((POKEMONS_URL + `/${pokemon.id}`), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        let li = document.getElementById(`pokemon-${pokemon.id}`)
        li.remove()
    })
}

// method calls
fetchAllTrainers()