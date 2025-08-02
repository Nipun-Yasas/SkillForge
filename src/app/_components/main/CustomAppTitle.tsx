import Box from '@mui/material/Box';
import Image from 'next/image';


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
        width={90}
        height={50}
      />
    </Box>
  );
}
