let api = "https://pokeapi.co/api/v2/pokemon";
let items = document.querySelector('.main-container');
let limit = 20;
let offset = 20;
let typingTimeout;
const renderPokemonData = (allPokemons) => {
    allPokemons.forEach((pokemon)=>{
        let card = document.createElement('div');
        card.className = 'container';
        card.innerHTML=`<div class='card'>
                        <div class='thefront'>
                            <img src="${pokemon.image}" />
                            <p>${pokemon.name}</p>
                            <p>Type: ${pokemon.types.join(", ")}</p>
                        </div>
                        <div class='theback'>
                            <i>height : ${pokemon.height}</i>
                            </br>
                            <i>weight : ${pokemon.weight}</i>
                            <p> ${pokemon?.stats?.map((el) => `${el?.stat + " :- " + el?.base_stat}</br>`)}</p>
                        </div>
                        </div>`;
        items.appendChild(card);
    })
}
const renderPokemonData1 = (allPokemons) => {
    allPokemons.forEach((pokemon)=>{
        const types = Array.isArray(pokemon.types)
        ? pokemon.types.join(", ")
        : "Unknown";
        let card = document.createElement('div');
        card.className = 'container';
        card.innerHTML=`<div class='card'>
                        <div class='thefront'>
                            <img src="${pokemon.image}" />
                            <p>${pokemon.name}</p>
                             <p>Type: ${types}</p>
                        </div>
                        <div class='theback'>
                            <i>height : ${pokemon.height}</i>
                            </br>
                            <i>weight : ${pokemon.weight}</i>
                            <p> ${pokemon?.stats?.map((el) => `${el?.stat + " :- " + el?.base_stat}</br>`)}</p>
                        </div>
                        </div>`;
        items.appendChild(card);
    })
}

const getPokemonData= async (url=api)=>{
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const promises = data?.results?.map((ele)=>{
        return fetch(ele.url)
            .then((res)=>res.json())
            .then((data)=>{
                return{
                    name : data?.name,
                    height : data?.height,
                    weight: data?.weight,
                    base_experience: data?.base_experience,
                    types: data?.types?.map((el)=>{
                        return el?.type.name;
                    }),
                    stats: data?.stats?.map((el)=>{
                        return{ ...el,["stat"]: el.stat.name};
                    }),
                    image: data?.sprites?.other?.dream_world?.front_default,
                };
            });
    });
    const pokemonData = await Promise.all(promises);
    renderPokemonData(pokemonData);  
};
getPokemonData(api);


let button = document.getElementById('btn1')
button.addEventListener('click',async()=>{
    offset = offset+20;
    const nextapi=`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    getPokemonData(nextapi);
})

let catSearch = document.getElementById('category');
catSearch.addEventListener('change',async(e)=>{
    items.innerHTML="";
    let val = e.target.value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/type/${val}`);
    const data = await response.json();
    const promises = data?.pokemon?.map((p)=>{
        return fetch(p.pokemon.url)
            .then((res)=>res.json())
            .then((data)=>{
                return{
                    name : data?.name,
                    height : data?.height,
                    weight: data?.weight,
                    base_experience: data?.base_experience,
                    types: data?.types?.map((el)=>{
                        return el?.type.name;
                    }),
                    stats: data?.stats?.map((el)=>{
                        return{ ...el,["stat"]: el.stat.name};
                    }),
                    image: data?.sprites?.other?.dream_world?.front_default ||data?.sprites?.front_default,
                };
            });
            
    });
    const pokemonData = await Promise.all(promises);
    renderPokemonData1(pokemonData);  
})
const searchPokemonByName = async (name) => {
    items.innerHTML='';
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
        items.innerHTML = "<p style='color: white;'>Pokemon not found</p>";
        return;
        }
        const data = await response.json();
        const types = data.types.map((el) => el.type.name);
        const stats = data.stats.map((el) => ({
            stat: el.stat.name,
            base_stat: el.base_stat
        }));
        const image = data.sprites?.other?.dream_world?.front_default ||
                      data.sprites?.front_default ||
                      "https://via.placeholder.com/150";

        const pokemon = {
            name: data.name,
            height: data.height,
            weight: data.weight,
            types,
            stats,
            image
        };
        renderPokemonData([pokemon]);
    }
    catch{
        items.innerHTML = "<p style='color: white;'>Error fetching Pokémon data.</p>";
    }
}

let input = document.getElementById('inpField');
input.addEventListener('input',(e)=>{
    clearTimeout(typingTimeout);
    let val1 = e.target.value.trim().toLowerCase();
    console.log("Typing:", val1);   
    if (val1 === "") {
    items.innerHTML = "";
    return;
    }

    typingTimeout = setTimeout(() => {
        searchPokemonByName(val1); 
    }, 500)
})
