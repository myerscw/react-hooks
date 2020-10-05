// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [{status, error, pokemon}, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: 'pending'})

    fetchPokemon(pokemonName).then(
      data => {
        setState({pokemon: data, status: 'resolved'})
      },
      err => {
        setState({error: err, status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return <span>Submit a pokemon</span>
  }

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  if (status === 'rejected') {
    throw error
  }
}

const Fallback = ({error, resetErrorBoundary}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>reset</button>
  </div>
)

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={Fallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
