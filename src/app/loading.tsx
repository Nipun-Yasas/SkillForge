"use client";

import Box from "@mui/material/Box";
import Image from "next/image";

export default function Loading() {
  return (
    <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#f8f9fa',
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Image 
          src="/loader.gif" 
          alt="Loading..." 
          width={0}
          height={0}
          style={{ 
            width: 'auto',
            height: 'auto',
            maxWidth: '80vw',
            maxHeight: '30vh', 
            borderRadius: '10px',
          }}
          unoptimized
        />
        
      </Box>
  );
}
