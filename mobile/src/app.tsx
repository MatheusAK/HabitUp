import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree'  // ← usa a versão mobile

const queryClient = new QueryClient()
const hashHistory = createHashHistory()

const router = createRouter({
  routeTree,
  history: hashHistory,
  context: { queryClient },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}