import Box from '@mui/material/Box';
import Image from 'next/image';

import SearchBar from './SearchBar'; 

export default function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%', 
        px: 2,
        gap:5 
      }}
    >
      <Image
        src="/logo.svg"
        alt="Company Logo"
        width={100}
        height={100}
      />
      <SearchBar/>
    </Box>
  );
}
