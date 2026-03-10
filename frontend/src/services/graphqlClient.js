/**
 * Lightweight GraphQL client using fetch().
 * Sends queries/mutations to the backend /graphql endpoint
 * with session cookies included for authentication.
 */

const GRAPHQL_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/graphql'

export async function graphqlRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()

  if (json.errors && json.errors.length > 0) {
    const err = json.errors[0]
    const error = new Error(err.message)
    error.code = err.extensions?.code
    throw error
  }

  return json.data
}
