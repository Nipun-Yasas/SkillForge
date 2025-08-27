"use client";

import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";

export default function CourseCardSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card
          key={idx}
          sx={{
            height: "100%",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
          }}
        >
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
          />
          <CardContent>
            <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ mr: 1 }}
              />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={28}
              sx={{ mb: 2, borderRadius: 1 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton
                variant="rectangular"
                width={90}
                height={36}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
