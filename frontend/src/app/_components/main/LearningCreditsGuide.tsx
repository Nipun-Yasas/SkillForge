'use client';

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
} from '@mui/material';
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
} from '@mui/icons-material';
import { useState } from 'react';

const LearningCreditsGuide = () => {
  const [openConvertDialog, setOpenConvertDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleConvertCredits = async () => {
    try {
      const response = await fetch('/api/credits/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(convertAmount) }),
      });

      const data = await response.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Credits converted successfully!' });
        setOpenConvertDialog(false);
        setConvertAmount('');
      } else {
        setAlert({ type: 'error', message: data.error });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to convert credits' });
    }
  };

  const handlePurchaseCredits = async () => {
    try {
      // In a real app, you'd integrate with a payment processor here
      const mockPaymentData = {
        amount: parseInt(purchaseAmount),
        paymentMethod: 'stripe',
        transactionId: `tx_${Date.now()}`,
        amountPaid: parseInt(purchaseAmount) * 2, // $2 per credit
      };

      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPaymentData),
      });

      const data = await response.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Credits purchased successfully!' });
        setOpenPurchaseDialog(false);
        setPurchaseAmount('');
      } else {
        setAlert({ type: 'error', message: data.error });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to purchase credits' });
    }
  };

  const steps = [
    {
      label: 'Welcome Bonus',
      icon: <CardGiftcard sx={{ color: '#4CAF50' }} />,
      description: 'Get 10 free learning credits when you first sign up',
      action: 'Automatic on registration',
      color: '#4CAF50',
    },
    {
      label: 'Teach to Earn',
      icon: <School sx={{ color: '#2196F3' }} />,
      description: 'Earn teaching credits by conducting sessions, then convert them to learning credits',
      action: 'Teach sessions → Convert credits',
      color: '#2196F3',
    },
    {
      label: 'Achievement Bonuses',
      icon: <EmojiEvents sx={{ color: '#FF9800' }} />,
      description: 'Earn bonus credits for completing courses, high ratings, and milestones',
      action: 'Complete achievements',
      color: '#FF9800',
    },
    {
      label: 'Purchase Credits',
      icon: <AttachMoney sx={{ color: '#9C27B0' }} />,
      description: 'Buy learning credits with real money for instant access',
      action: 'Premium feature - $2 per credit',
      color: '#9C27B0',
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

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp sx={{ color: '#2196F3' }} />
        How to Get Learning Credits
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Learning credits are the currency you use to book sessions with teachers. Here are all the ways to get them:
      </Typography>

      {/* Credit Methods Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
        {steps.map((step, index) => (
          <Card key={index} sx={{ border: `2px solid ${step.color}`, position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {step.icon}
                <Typography variant="h6" sx={{ color: step.color }}>
                  {step.label}
                </Typography>
                <Chip 
                  label={`#${index + 1}`} 
                  size="small" 
                  sx={{ backgroundColor: step.color, color: 'white' }}
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {step.description}
              </Typography>
              <Typography variant="caption" sx={{ color: step.color, fontWeight: 'bold' }}>
                {step.action}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Detailed Steps */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>📚 Step-by-Step Guide</Typography>
          
          <Stepper orientation="vertical">
            <Step expanded>
              <StepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CardGiftcard sx={{ color: '#4CAF50' }} />
                  Sign Up & Get Welcome Bonus
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Every new user receives <strong>10 learning credits</strong> for free! This gives you enough to book your first few sessions and get started on the platform.
                </Typography>
                <Chip label="10 Credits" color="success" size="small" />
              </StepContent>
            </Step>

            <Step expanded>
              <StepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ color: '#2196F3' }} />
                  Become a Teacher
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  The core of SkillForge&apos;s barter economy! Teach what you know to earn teaching credits, then convert them to learning credits at a 1:1 ratio.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label="1 hour taught = 2 teaching credits" size="small" />
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents sx={{ color: '#FF9800' }} />
                  Earn Achievement Bonuses
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Complete various achievements to earn bonus credits:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label="Complete first course: +5 credits" size="small" />
                  <Chip label="5-star rating: +2 credits" size="small" />
                  <Chip label="Refer a friend: +10 credits" size="small" />
                  <Chip label="Weekly goals: +3 credits" size="small" />
                </Box>
              </StepContent>
            </Step>

            <Step expanded>
              <StepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ color: '#9C27B0' }} />
                  Purchase Credits (Premium)
                </Box>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Need credits immediately? Purchase them with real money for instant access to any session you want.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label="$2 per credit" size="small" />
                  <Chip label="Bulk discounts available" size="small" />
                  <Chip label="Instant delivery" size="small" />
                </Box>
                <Button 
                  variant="contained" 
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setOpenPurchaseDialog(true)}
                  sx={{ backgroundColor: '#9C27B0' }}
                >
                  Purchase Credits
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>💡 Credit Usage Examples</Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Group /> Group Session (30 min)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Math tutoring with 3 other students
              </Typography>
              <Chip label="1 credit" color="success" size="small" sx={{ mt: 1 }} />
            </Box>

            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School /> Individual Session (1 hour)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                One-on-one programming lesson
              </Typography>
              <Chip label="2 credits" color="primary" size="small" sx={{ mt: 1 }} />
            </Box>

            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star /> Premium Session (1 hour)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced machine learning with expert
              </Typography>
              <Chip label="3 credits" color="warning" size="small" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Convert Credits Dialog */}
      <Dialog open={openConvertDialog} onClose={() => setOpenConvertDialog(false)} maxWidth="sm" fullWidth>
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
      <Dialog open={openPurchaseDialog} onClose={() => setOpenPurchaseDialog(false)} maxWidth="sm" fullWidth>
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
            <Typography variant="body2" sx={{ mt: 2, color: '#9C27B0', fontWeight: 'bold' }}>
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
            sx={{ backgroundColor: '#9C27B0' }}
          >
            Purchase for ${purchaseAmount ? parseInt(purchaseAmount) * 2 : 0}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LearningCreditsGuide;
