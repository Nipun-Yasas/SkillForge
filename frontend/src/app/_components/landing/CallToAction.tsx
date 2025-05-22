import { useEffect,useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function Hero() {

  const actionRef = useRef(null);
  
    useEffect(() => {
      if (!actionRef.current) return;
  
      const ctx = gsap.context(() => {
        const element = actionRef.current;
  
        const anim = gsap.fromTo(
          element,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }
        );
  
        ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
          animation: anim,
          onEnter: () => {
            gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
          },
          onLeave: () => {
            gsap.to(element, { opacity: 0, y: 100, duration: 1, ease: "power3.out" });
          },
          onLeaveBack: () => {
            gsap.to(element, { opacity: 0, y: -100, duration: 1, ease: "power3.out" });
          },
          onEnterBack: () => {
            gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
          },
        });
      }, actionRef);
  
      return () => ctx.revert();
    }, []);

  return (
    <Box
    ref={actionRef}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: 2,
        mb: { xs: 0, md: 5 },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          zIndex: 2,
          p: 2.5,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary.main"
          sx={{ lineHeight: { xs: "40px", md: "40px" },mt:{xs:5,md:3} }}
        >
          Start Learning Today with SkillForge!
        </Typography>

        <Typography variant="h6" sx={{ display: "block", mb: 2 }}>
          Unlock new skills, connect with peers, and grow together!
        </Typography>
        <Typography variant="body1">
          At SkillForge, learning is a two-way street. Whether you want to learn
          a new skill or share your expertise, our platform makes it easy, fun,
          and accessible.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Link href="/signUp" passHref>
            <Button variant="contained" size="large">
              Join Now
            </Button>
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: { xs: 300, md: 350 },
            left: { xs: "60%", md: "40%" },
            top: "60%",
            backgroundColor: "shapeColor.main",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            height: { xs: 450, md: 450 },
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />

        <Image
          src="/Footer.svg"
          alt="Hero illustration"
          width={300}
          height={300}
          priority
          style={{
            position: "relative",
            zIndex: 2,
             height: "auto",
            width: "100%",
            maxWidth: "400px"
          }}
        />
      </Box>
    </Box>
  );
}
