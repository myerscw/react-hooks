// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function useLocalStorageState(
  key,
  initial = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const storageValue = window.localStorage.getItem(key)
    if (storageValue) {
      return deserialize(storageValue)
    }
    return typeof initial === 'function' ? initial() : initial
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(key)
      prevKeyRef.current = key
    }

    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
