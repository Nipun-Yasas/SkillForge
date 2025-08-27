'use client';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function CourseDetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Media + Enroll */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={240} sx={{ mb: 3, borderRadius: 2 }} />
          <Skeleton variant="text" width={120} height={38} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={44} sx={{ mb: 2, borderRadius: 1 }} />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={120} />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={120} />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={120} />
            </Box>
          </Box>
        </Paper>

        {/* Header + Instructor */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={42} />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
          </Box>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={64} height={64} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={160} />
              <Skeleton variant="text" width={240} />
            </Box>
          </Box>
        </Paper>

        {/* Learning Outcomes */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="85%" />
            <Skeleton variant="text" width="80%" />
          </Stack>
        </Paper>

        {/* Prerequisites */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="65%" />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}