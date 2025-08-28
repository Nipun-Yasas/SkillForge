'use client';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function LearnVideoSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button disabled sx={{ mb: 2, width: 180 }}>
        <Skeleton width={120} />
      </Button>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Skeleton variant="text" width="40%" height={38} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Stack>
        <Box sx={{ position: 'relative', pb: '56.25%', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', inset: 0 }} />
        </Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={140} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
        </Stack>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={60} />
        </Stack>
      </Paper>
    </Container>
  );
}