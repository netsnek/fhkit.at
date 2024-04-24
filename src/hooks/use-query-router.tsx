import {useEffect, useState} from 'react'

export const useQueryRouter = (
  location: {
    pathname: string
    search: string
  },
  paramKey: string
) => {
  const [isCalled, setIsCalled] = useState(false)
  const [paramValue, setParamValue] = useState('')

  useEffect(() => {
    // Function to check the URL query string for the provided key
    function checkQueryKey() {
      const params = new URLSearchParams(location?.search)
      setIsCalled(params.has(paramKey))
      setParamValue(params.get(paramKey) as string)
    }

    // Check the query key on initial render
    checkQueryKey()
  }, [location?.pathname, location?.search])

  // Return isCalled and kthe value of the param in the URL
  return {
    isCalled,
    paramValue
  }
}
