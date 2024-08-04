import React, { useEffect, useState } from 'react'
import { Data } from '../services/types'
import { searchFile } from '../services/search'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

const DEBOUNCE_TIME = 300

const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>([])
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('q') ?? ''
  })
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

  const handleSarch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    const newPathName = !search ? window.location.pathname : `?q=${search}`
    window.history.pushState({}, '', newPathName)
  }, [search])

  useEffect(() => {
    if (!debouncedSearch) {
      setData(initialData)
      return
    }
    searchFile(debouncedSearch)
      .then((response) => {
        const [error, newData] = response
        if (error) toast(error.message)

        if (newData) setData(newData)
      })
      .catch((e) => toast(e?.message))
  }, [debouncedSearch, initialData])

  return (
    <div>
      <h1>Search</h1>
      <form>
        <input
          onChange={handleSarch}
          type='search'
          placeholder='Search in csv'
          value={search}
        />
      </form>
      <ul>
        {data.map((row, index) => (
          <li key={(row.id ?? Math.random()) + index}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={Math.random() + key}>
                  <strong>{key}:</strong>
                  {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Search
