import { useState } from 'react';
import { SearchPage } from './components/SearchPage';
import { CompanyProfilePage } from './components/CompanyProfilePage';

export default function App() {
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  if (selectedUsername) {
    return (
      <CompanyProfilePage
        username={selectedUsername}
        onBack={() => setSelectedUsername(null)}
      />
    );
  }

  return <SearchPage onSelectCompany={setSelectedUsername} />;
}
