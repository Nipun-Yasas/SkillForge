"use client";

import { Box, Card, CardContent, Skeleton, Divider } from "@mui/material";

export default function RewardsSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Rewards Overview (auto-fit minmax(300px, 1fr)) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
            <Skeleton variant="text" width="50%" sx={{ mx: "auto" }} />
            <Skeleton variant="text" width="30%" height={40} sx={{ mx: "auto" }} />
          </Card>
        ))}
      </Box>

      {/* Available Rewards heading */}
      <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />

      {/* Available Rewards (auto-fit minmax(400px, 1fr)) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: 3,
          mb: 6,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} sx={{ p: 3, borderRadius: 3 }}>
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
        ))}
      </Box>

      {/* Reward History heading */}
      <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />

      {/* Reward History list (Card with rows) */}
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