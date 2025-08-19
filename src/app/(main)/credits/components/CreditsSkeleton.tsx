"use client";

import { Box, Card, CardContent, Divider, Grid, Skeleton } from "@mui/material";

export default function CreditsSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="text" width={220} height={40} />
      </Box>

      {/* Credit Overview */}
      <Grid
        container
        spacing={3}
        sx={{
          mb: 4,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mx: "auto" }} />
              <Skeleton variant="text" width="70%" sx={{ mx: "auto" }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Level & Reputation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={28} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Skeleton variant="rectangular" width={90} height={28} sx={{ borderRadius: 14 }} />
            <Skeleton variant="text" width={220} height={32} />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={60} />
            </Box>
            <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
          </Box>

          <Skeleton variant="text" width={280} />
        </CardContent>
      </Card>

      {/* Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Skeleton variant="text" width={160} height={28} sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Skeleton variant="rectangular" width={170} height={40} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={160} height={40} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box>
                    <Skeleton variant="text" width={240} />
                    <Skeleton variant="text" width={180} />
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Skeleton variant="text" width={60} sx={{ ml: "auto" }} />
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12, ml: "auto" }} />
                </Box>
              </Box>
              {i < 4 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}