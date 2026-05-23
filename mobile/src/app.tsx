import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { routeTree } from '../../src/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const hashHistory = createHashHistory()

const router = createRouter({
  routeTree,
  history: hashHistory,
  context: { queryClient }, // ← isso resolve o erro de tipo
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}