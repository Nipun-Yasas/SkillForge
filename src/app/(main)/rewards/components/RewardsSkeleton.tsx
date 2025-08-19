"use client";

import { Box, Card, CardContent, Grid, Skeleton, Divider } from "@mui/material";

export default function RewardsSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="text" width={220} height={40} />
      </Box>

      {/* Overview cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid size={{xs:12,sm:6,md:4}} key={i}>
            <Card sx={{ textAlign: "center", p: 2, borderRadius: 3 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="70%" sx={{ mx: "auto" }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Available Rewards heading */}
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />

      {/* Rewards grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Card sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="text" width="40%" height={28} sx={{ flex: 1 }} />
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                </Box>

                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="85%" sx={{ mb: 2 }} />

                <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />

                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reward History heading */}
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />

      {/* Reward History list */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Box>
                    <Skeleton variant="text" width={220} />
                    <Skeleton variant="text" width={160} />
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Skeleton variant="rectangular" width={90} height={24} sx={{ borderRadius: 12, ml: "auto" }} />
                  <Skeleton variant="text" width={80} sx={{ ml: "auto", mt: 1 }} />
                </Box>
              </Box>
              {i < 3 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}