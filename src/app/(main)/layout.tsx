"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";
import { useTheme, alpha } from "@mui/material/styles";

import FunctionsIcon from "@mui/icons-material/Functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TimelineIcon from "@mui/icons-material/Timeline";
import CodeIcon from "@mui/icons-material/Code";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MemoryIcon from "@mui/icons-material/Memory";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PublicIcon from "@mui/icons-material/Public";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DataObjectIcon from "@mui/icons-material/DataObject";

import { useAuth } from "@/contexts/AuthContext";
import CustomToolbarActions from "../_components/main/CustomToolbarActions";
import CustomAppTitle from "../_components/main/CustomAppTitle";
import Chatbot from "../_components/chatbot/Chatbot"
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (!user) {
    return null;
  }

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
    100% { transform: translateY(0px); }
  `;
  const spin = keyframes`
    0% { transform: rotate(0deg) }
    50% { transform: rotate(6deg) }
    100% { transform: rotate(0deg) }
  `;
  const toneColor = (pal: "primary" | "secondary", tone: "light" | "main" | "dark") =>
    (theme.palette as any)[pal][tone];
  const artifacts = [
    { Icon: FunctionsIcon,      top: "12%", left: "35%",  size: { xs: 56, md: 96 }, pal: "primary",   tone: "main", a: 0.1,d: 12, delay: 0.1 },
    { Icon: LightbulbIcon,      top: "9%", left: "55%",  size: { xs: 56, md: 96 }, pal: "primary",   tone: "main", a: 0.1, d: 12, delay: 0.1 },
    { Icon: RocketLaunchIcon,      top: "15%", left: "68%",  size: { xs: 56, md: 96 }, pal: "primary",   tone: "main", a: 0.1, d: 12, delay: 0.1 },
    { Icon: CalculateIcon,      top: "22%", left: "78%", size: { xs: 52, md: 92 }, pal: "secondary", tone: "main", a: 0.1, d: 11, delay: 0.4 },
    { Icon: ScienceIcon,        top: "68%", left: "6%",  size: { xs: 60, md: 104 }, pal: "primary",   tone: "light", a: 0.1, d: 14, delay: 0.2 },
    { Icon: BiotechIcon,        top: "76%", left: "72%", size: { xs: 50, md: 90 }, pal: "secondary", tone: "light", a: 0.1, d: 13, delay: 0.5 },
    { Icon: BarChartIcon,       top: "18%", left: "46%", size: { xs: 54, md: 94 }, pal: "primary",   tone: "dark", a: 0.1, d: 12, delay: 0.3 },
    { Icon: BusinessCenterIcon, top: "34%", left: "19%", size: { xs: 50, md: 90 }, pal: "secondary", tone: "dark", a: 0.1, d: 12, delay: 0.8 },
    { Icon: PieChartIcon,       top: "58%", left: "86%", size: { xs: 56, md: 96 }, pal: "primary",   tone: "main", a: 0.1, d: 15, delay: 0.6 },
    { Icon: PsychologyIcon,     top: "64%", left: "38%", size: { xs: 52, md: 92 }, pal: "secondary", tone: "main", a: 0.1, d: 11, delay: 0.25 },
    { Icon: SchoolIcon,         top: "28%", left: "60%", size: { xs: 52, md: 92 }, pal: "primary",   tone: "light", a: 0.1, d: 16, delay: 0.7 },
    { Icon: TimelineIcon,       top: "92%", left: "21%", size: { xs: 50, md: 88 }, pal: "secondary", tone: "light", a: 0.1, d: 13, delay: 0.9 },
   // Left edge
  { Icon: CodeIcon,         top: "8%",  left: "94%", size: { xs: 60, md: 104 }, pal: "primary",   tone: "main",  a: 0.1, d: 12, delay: 0.1 },
  { Icon: HistoryEduIcon,   top: "55%", left: "22%", size: { xs: 56, md: 96  }, pal: "secondary", tone: "dark",  a: 0.1, d: 13, delay: 0.2 },
  { Icon: WorkspacesIcon,   top: "67%", left: "96%",size: { xs: 56, md: 96  }, pal: "secondary", tone: "main",  a: 0.1, d: 14, delay: 0.55 },
  { Icon: DataObjectIcon,   top: "87%", left: "90%", size: { xs: 54, md: 92  }, pal: "primary",   tone: "light", a: 0.1, d: 15, delay: 0.75 },

  // Right edge
  { Icon: AutoGraphIcon,    top: "25%", left: "90%",  size: { xs: 60, md: 104 }, pal: "secondary", tone: "main",  a: 0.1, d: 12, delay: 0.2 },
  { Icon: QueryStatsIcon,   top: "45%", left: "92%", size: { xs: 56, md: 100 }, pal: "primary",   tone: "light", a: 0.1, d: 11, delay: 0.4 },
  { Icon: LanguageIcon,     top: "64%", left: "59%",  size: { xs: 58, md: 102 }, pal: "primary",   tone: "main",  a: 0.1, d: 13, delay: 0.6 },
  { Icon: MemoryIcon,       top: "75%", left: "18%", size: { xs: 56, md: 96  }, pal: "secondary", tone: "light", a: 0.1, d: 14, delay: 0.25 },
  { Icon: ShowChartIcon,    top: "76%", left: "45%",  size: { xs: 56, md: 96  }, pal: "primary",   tone: "light", a: 0.1, d: 15, delay: 0.5 },
  { Icon: PublicIcon,       top: "92%", left: "50%", size: { xs: 54, md: 92  }, pal: "secondary", tone: "light", a: 0.1, d: 16, delay: 0.7 },
] as const;

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: CustomToolbarActions,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          filter: "blur(4px) saturate(1.05) brightness(1.02)",
          transform: "translateZ(0)",
          willChange: "filter",
        }}
      >
        {artifacts.map((a, i) => {
          const color = alpha(toneColor(a.pal, a.tone), a.a);
          const glow = alpha(toneColor(a.pal, a.tone), Math.min(a.a + 0.15, 0.5));
          const IconComp = a.Icon;
          return (
            <Box
              key={i}
              sx={{
                position: "absolute",
                top: a.top,
                left: a.left,
                userSelect: "none",
                transformOrigin: "center",
                animation: `${float} ${a.d}s ease-in-out ${a.delay}s infinite`,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  animation: `${spin} ${a.d + 4}s ease-in-out ${a.delay / 2}s infinite`,
                  filter: `saturate(1.05) drop-shadow(0 10px 24px ${glow})`,
                }}
              >
                <IconComp
                  sx={{
                    fontSize: { xs: a.size.xs, md: a.size.md },
                    color,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      <PageContainer
        
      >
        {children}
        <Chatbot />
      </PageContainer>
    </DashboardLayout>
  );
}
