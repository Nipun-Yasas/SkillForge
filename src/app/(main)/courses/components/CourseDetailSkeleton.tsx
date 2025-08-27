'use client';

import { Container, Stack, Paper, Skeleton, Box, Divider, Grid } from '@mui/material';

export default function CourseDetailSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header + Instructor, Prerequisites, What You'll Learn */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
              <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={42} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Skeleton variant="rounded" width={120} height={28} />
                <Skeleton variant="rounded" width={120} height={28} />
                <Skeleton variant="rounded" width={120} height={28} />
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
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Skeleton variant="text" width="85%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="70%" />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
              <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="82%" />
                <Skeleton variant="text" width="76%" />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Enrollment card */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={44} sx={{ mb: 2, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={44} sx={{ mb: 3, borderRadius: 1 }} />
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
      </Stack>
    </Container>
  );
}