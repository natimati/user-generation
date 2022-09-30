import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import Selectors from './components/Selectors';
import UserTable from './components/UserTableGenerator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  const [seed, setSeed] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Selectors region={region} seed={seed} setSeed={setSeed} setRegion={setRegion} />
        <UserTable seed={seed} region={region} />
      </Container>
    </QueryClientProvider>
  )
}

export default App;
