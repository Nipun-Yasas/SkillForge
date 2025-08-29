"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import {
  School,
  AttachMoney,
  Star,
  Group,
  SwapHoriz,
  CardGiftcard,
  TrendingUp,
  EmojiEvents,
  Add,
  CheckCircle,
  Search,
  CalendarMonth,
  Chat,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import theme from "@/theme";

export default function CreditsGuide() {
  const router = useRouter();
  const [openConvertDialog, setOpenConvertDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Fetch current credits on component load
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits");
        const data = await response.json();
        if (data.success) {
          setTotalCredits(data.data.creditInfo.learningCredits || 0);
        }
      } catch (error) {
        console.log("Could not fetch credits:", error);
      }
    };

    fetchCredits();
  }, []);

  const handleConvertCredits = async () => {
    try {
      const response = await fetch("/api/credits/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(convertAmount) }),
      });

      const data = await response.json();
      if (data.success) {
        setAlert({
          type: "success",
          message: "Credits converted successfully!",
        });
        setOpenConvertDialog(false);
        setConvertAmount("");

        // Refresh total credits
        const creditsResponse = await fetch("/api/credits");
        const creditsData = await creditsResponse.json();
        if (creditsData.success) {
          setTotalCredits(creditsData.data.creditInfo.learningCredits || 0);
        }
      } else {
        setAlert({ type: "error", message: data.error });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to convert credits" });
    }
  };

  const handlePurchaseCredits = async () => {
    try {
      // In a real app, you'd integrate with a payment processor here
      const mockPaymentData = {
        amount: parseInt(purchaseAmount),
        paymentMethod: "stripe",
        transactionId: `tx_${Date.now()}`,
        amountPaid: parseInt(purchaseAmount) * 2, // $2 per credit
      };

      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPaymentData),
      });

      const data = await response.json();
      if (data.success) {
        // Fetch updated total credits
        const creditsResponse = await fetch("/api/credits");
        const creditsData = await creditsResponse.json();

        if (creditsData.success) {
          setTotalCredits(creditsData.data.creditInfo.learningCredits || 0);
        }

        setOpenPurchaseDialog(false);
        setPurchaseAmount("");
        setOpenSuccessDialog(true);
      } else {
        setAlert({ type: "error", message: data.error });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to purchase credits" });
    }
  };

  const steps = [
    {
      label: "Welcome Bonus",
      icon: <CardGiftcard sx={{ color: "#4CAF50" }} />,
      description: "Get 10 free learning credits when you first sign up",
      action: "Automatic on registration",
      color: "#4CAF50",
    },
    {
      label: "Teach to Earn",
      icon: <School sx={{ color: "#2196F3" }} />,
      description:
        "Earn teaching credits by conducting sessions, then convert them to learning credits",
      action: "Teach sessions → Convert credits",
      color: "#2196F3",
    },
    {
      label: "Achievement Bonuses",
      icon: <EmojiEvents sx={{ color: "#FF9800" }} />,
      description:
        "Earn bonus credits for completing courses, high ratings, and milestones",
      action: "Complete achievements",
      color: "#FF9800",
    },
    {
      label: "Purchase Credits",
      icon: <AttachMoney sx={{ color: "#9C27B0" }} />,
      description: "Buy learning credits with real money for instant access",
      action: "Premium feature - $2 per credit",
      color: "#9C27B0",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}
      <Paper
        elevation={10}
        sx={{
          p: 3,
          mb: 4,
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(10px) saturate(1.08)",
          WebkitBackdropFilter: "blur(10px) saturate(1.08)",
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 40px rgba(0,0,0,0.45)"
              : "0 10px 40px rgba(0,0,0,0.12)",
          transition: "background-color 200ms ease, backdrop-filter 200ms ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <TrendingUp sx={{ color: "#2196F3" }} />
          How to Get Learning Credits
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Learning credits are the currency you use to book sessions with
            teachers. Here are all the ways to get them:
          </Typography>
          <Card sx={{ p: 2, border: "2px solid #4CAF50" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, textAlign: "center" }}
            >
              Your Current Balance
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Star sx={{ color: "#4CAF50" }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#4CAF50" }}
              >
                {totalCredits} Credits
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Credit Methods Overview */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 3,
            mb: 4,
          }}
        >
          {steps.map((step, index) => (
            <Card
              key={index}
              sx={{ border: `2px solid ${step.color}`, position: "relative" }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  {step.icon}
                  <Typography variant="h6" sx={{ color: step.color }}>
                    {step.label}
                  </Typography>
                  <Chip label={`#${index + 1}`} size="small" />
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {step.description}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {step.action}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Detailed Steps */}
      <Card
        elevation={10}
        sx={{
          p: 3,
          mb: 4,
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(10px) saturate(1.08)",
          WebkitBackdropFilter: "blur(10px) saturate(1.08)",
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 40px rgba(0,0,0,0.45)"
              : "0 10px 40px rgba(0,0,0,0.12)",
          transition: "background-color 200ms ease, backdrop-filter 200ms ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
          },
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📚 Step-by-Step Guide
          </Typography>

          <Stepper orientation="vertical">
            <Step expanded>
              <StepLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CardGiftcard sx={{ color: "#4CAF50" }} />
                  Sign Up & Get Welcome Bonus
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Every new user receives <strong>10 learning credits</strong>{" "}
                  for free! This gives you enough to book your first few
                  sessions and get started on the platform.
                </Typography>
                <Chip label="10 Credits" color="success" size="small" />
              </StepContent>
            </Step>

            <Step expanded>
              <StepLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ color: "#2196F3" }} />
                  Become a Teacher
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  The core of SkillForge&apos;s barter economy! Teach what you
                  know to earn teaching credits, then convert them to learning
                  credits at a 1:1 ratio.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Chip
                    label="1 hour taught = 2 teaching credits"
                    size="small"
                  />
                  <Chip label="High ratings = bonus credits" size="small" />
                  <Chip label="1:1 conversion ratio" size="small" />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SwapHoriz />}
                  onClick={() => setOpenConvertDialog(true)}
                >
                  Convert Teaching Credits
                </Button>
              </StepContent>
            </Step>

            <Step expanded>
              <StepLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmojiEvents sx={{ color: "#FF9800" }} />
                  Earn Achievement Bonuses
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Complete various achievements to earn bonus credits:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Chip
                    label="Complete first course: +5 credits"
                    size="small"
                  />
                  <Chip label="5-star rating: +2 credits" size="small" />
                  <Chip label="Refer a friend: +10 credits" size="small" />
                  <Chip label="Weekly goals: +3 credits" size="small" />
                </Box>
              </StepContent>
            </Step>

            <Step expanded>
              <StepLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoney sx={{ color: "#9C27B0" }} />
                  Purchase Credits (Premium)
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Need credits immediately? Purchase them with real money for
                  instant access to any session you want.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Chip label="$2 per credit" size="small" />
                  <Chip label="Bulk discounts available" size="small" />
                  <Chip label="Instant delivery" size="small" />
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setOpenPurchaseDialog(true)}
                  sx={{ backgroundColor: "#9C27B0" }}
                >
                  Purchase Credits
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card
        elevation={10}
        sx={{
          mb: 4,
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(10px) saturate(1.08)",
          WebkitBackdropFilter: "blur(10px) saturate(1.08)",
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 40px rgba(0,0,0,0.45)"
              : "0 10px 40px rgba(0,0,0,0.12)",
          transition: "background-color 200ms ease, backdrop-filter 200ms ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
          },
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💡 Credit Usage Examples
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 2,
            }}
          >
            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Group /> Group Session (30 min)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Math tutoring with 3 other students
              </Typography>
              <Chip
                label="1 credit"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <School /> Individual Session (1 hour)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-on-one programming lesson
              </Typography>
              <Chip
                label="2 credits"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Star /> Premium Session (1 hour)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced machine learning with expert
              </Typography>
              <Chip
                label="3 credits"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Convert Credits Dialog */}
      <Dialog
        open={openConvertDialog}
        onClose={() => setOpenConvertDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Convert Teaching Credits</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Convert your teaching credits to learning credits at a 1:1 ratio.
          </Typography>
          <TextField
            fullWidth
            label="Amount to Convert"
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConvertDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConvertCredits}
            variant="contained"
            disabled={!convertAmount || parseInt(convertAmount) < 1}
          >
            Convert Credits
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Credits Dialog */}
      <Dialog
        open={openPurchaseDialog}
        onClose={() => setOpenPurchaseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Purchase Learning Credits</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Purchase learning credits for instant access. $2 per credit.
          </Typography>
          <TextField
            fullWidth
            label="Number of Credits"
            type="number"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ mt: 1 }}
          />
          {purchaseAmount && (
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "#9C27B0", fontWeight: "bold" }}
            >
              Total: ${parseInt(purchaseAmount) * 2}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPurchaseDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePurchaseCredits}
            variant="contained"
            disabled={!purchaseAmount || parseInt(purchaseAmount) < 1}
            sx={{ backgroundColor: "#9C27B0" }}
          >
            Purchase for ${purchaseAmount ? parseInt(purchaseAmount) * 2 : 0}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Confirmation Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <CheckCircle sx={{ fontSize: 60, color: "#4CAF50", mb: 2 }} />
          <Typography
            variant="h4"
            component="div"
            sx={{ color: "#4CAF50", fontWeight: "bold" }}
          >
            🎉 Credits Purchased Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              You now have{" "}
              <Chip
                label={`${totalCredits} total credits`}
                color="success"
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
              />{" "}
              in your account!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here&apos;s what you can do with your credits:
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 2,
              mb: 3,
            }}
          >
            <Card sx={{ p: 2, border: "2px solid #4CAF50" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Search sx={{ color: "#4CAF50", fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: "#4CAF50" }}>
                  Find Expert Mentors
                </Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Browse 500+ verified mentors" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Filter by skills, rating & availability" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Read reviews from other students" />
                </ListItem>
              </List>
            </Card>

            <Card sx={{ p: 2, border: "2px solid #2196F3" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <CalendarMonth sx={{ color: "#2196F3", fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: "#2196F3" }}>
                  Book Sessions
                </Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Schedule 1-on-1 or group sessions" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Choose your preferred time slots" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Get instant confirmation" />
                </ListItem>
              </List>
            </Card>

            <Card sx={{ p: 2, border: "2px solid #9C27B0" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Chat sx={{ color: "#9C27B0", fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: "#9C27B0" }}>
                  Start Learning
                </Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Connect with mentors instantly" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Chat before booking sessions" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star sx={{ color: "#FF9800", fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Get personalized learning paths" />
                </ListItem>
              </List>
            </Card>
          </Box>

          <Box sx={{ textAlign: "center", p: 3, borderRadius: 2 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold" }}>
              💡 Ready to start your learning journey?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse our amazing community of mentors and find the perfect match
              for your learning goals!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setOpenSuccessDialog(false)}
            variant="outlined"
            size="large"
          >
            Stay Here
          </Button>
          <Button
            onClick={() => {
              setOpenSuccessDialog(false);
              router.push("/findmentor");
            }}
            variant="contained"
            size="large"
            startIcon={<Search />}
            sx={{
              background: "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)",
              px: 3,
            }}
          >
            Find Mentors Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
