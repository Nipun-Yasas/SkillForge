"use client";

import Box from "@mui/material/Box";
import StatItem from "./StatItem";

const trained = 30;
const classes = 150;
const satisfaction = 100;
const community = 150;

export default function Stats() {
  return (
    <Box
      width="100%"
      id="stats"
      sx={{
        bgcolor: "featureColor.main",
        px: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <StatItem
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/daec5606ee8aa45277cec586b290bb1cf3348ea3?placeholderIfAbsent=true"
          number={trained}
          text="Successfully Trained"
        />
        <StatItem
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ad455c70ebdfbb477a78022db30e563f3fed5e46?placeholderIfAbsent=true"
          number={classes}
          text="Classes Completed"
        />
        <StatItem
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/afe3b919fa5b81676d6a6d8868d908025136d798?placeholderIfAbsent=true"
          number={satisfaction}
          text="Satisfaction Rate"
        />
        <StatItem
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8709b69cce85b3d079e8c6c9bf0810adf3fb225b?placeholderIfAbsent=true"
          number={community}
          text="Students Community"
        />
      </Box>
    </Box>
  );
}
