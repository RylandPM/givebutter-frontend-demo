import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonSpeciesByName, fetchPokemonDetailsByName, fetchEvolutionChainById } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState({
        name: '',
        moves: [],
        types: [],
        evolutionChain: []
    })


    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()
                //if to prevent reseting to full list
                if(searchValue === ''){
                    setPokemon(pokemonList)
                    setPokemonIndex(pokemonList)
                }
            }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [searchValue])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        setPokemon(
            // was !monster.name.includes(value) actively excluding our targets
            pokemonIndex.filter(monster => monster.name.includes(value))
        )
    }

    const searchForEvo = (tree, evolutionArray = []) => {
        evolutionArray.push(tree.species.name);
    
        if (tree.evolves_to.length > 0) {
            for (let evolutionLine of tree.evolves_to) {
                searchForEvo(evolutionLine, evolutionArray);
            }
        }
    
        return evolutionArray;
    };
    

    const onGetDetails = (name) => async () => {
        /** code here **/
        const {moves: pokemonMoves, types: pokemonTypes} = await fetchPokemonDetailsByName(name)
        const {evolution_chain: evoChainUrl} = await fetchPokemonSpeciesByName(name)
        
        const evoId = evoChainUrl.url.split('/').slice(-2,-1)
        const {chain: evoTree} = await fetchEvolutionChainById(evoId)
        const selectedEvos= searchForEvo(evoTree)
        
        setPokemonDetails({
            name: name,
            moves: pokemonMoves,
            types: pokemonTypes,
            evolutionChain : selectedEvos
        })
    }


    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {
                //converted to turnary to display no results found 
                pokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                             pokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                        {monster.name}
                                        </div>
                                    <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                </div>
                                )
                            })
                        }
                    </div>
                ) :
                    <div className={'pokedex__search-results'}>
                        <div className={'pokedex__list-item'}>
                            <div>
                                <span>
                                    No Results Found
                                </span>
                            </div>
                        </div>  
                    </div>
            }
                {
                    pokemonDetails.name !== '' ? (
                        <div className={'pokedex__details'}>
                            {/*  code here  */}
                            <div className={'pokedex__details-name'}>
                                {pokemonDetails.name}
                            </div>
                            <div className={'pokedex__moves-types'}>
                                <div className={'pokedex__types'}>
                                   <span className={'pokedex__bold'}>Types</span>
                                   <ul className={'pokedex__bullet-list-wrapper'}>
                                    {
                                        pokemonDetails.types.map(type => {
                                            return(
                                                <li className={'bullet__list-item'} key={type.name}>
                                                    {type.type.name}
                                                </li>
                                            )
                                        })
                                    }
                                    </ul> 
                                </div>
                                <div className={'pokedex__moves'}>
                                   <span className={'pokedex__bold'}>Moves</span> 
                                   <ul className={'pokedex__bullet-list-wrapper'}>
                                     {
                                        pokemonDetails.moves.map(move => {
                                            return(
                                                <li className={'bullet__list-item'} key={move.name}>
                                                    {move.move.name}
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                </div>
                            </div>
                            <div className={'pokedex__evolutions'}>
                                <span className={'pokedex__bold'}>Evolutions</span>
                                <div className={'italized-list'}>
                                {
                                    pokemonDetails.evolutionChain.map(evolution => {
                                        return(
                                            
                                            <ul className={'italized-list-item'} key={evolution}>
                                                {evolution}
                                            </ul>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default App;
