"use client";

import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";

export default function ManageCoursesSkeleton({ items = 6 }: { items?: number }) {
  return (
    <Box>
      {/* Grid of skeleton cards */}
      <Grid container spacing={3}>
        {Array.from({ length: items }).map((_, i) => (
          <Grid size={{xs:12,sm:6,lg:4}} key={i}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
              }}
            >
              {/* Image area */}
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="95%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />

                {/* Stats row */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" width={50} height={18} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" width={80} height={18} />
                  </Box>
                </Box>

                {/* Tags */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Skeleton variant="rectangular" width={70} height={26} sx={{ borderRadius: 16 }} />
                  <Skeleton variant="rectangular" width={60} height={26} sx={{ borderRadius: 16 }} />
                  <Skeleton variant="rectangular" width={50} height={26} sx={{ borderRadius: 16 }} />
                </Box>
              </CardContent>

              {/* Actions/Footer */}
              <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 6 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}