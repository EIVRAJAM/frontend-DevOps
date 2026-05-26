import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Aqui luego agregaremos los Providers (ThemeProvider, AuthProvider) */}
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
