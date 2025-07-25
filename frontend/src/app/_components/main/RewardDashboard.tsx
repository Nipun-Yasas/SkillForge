'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  AttachMoney,
  School,
  EmojiEvents,
  Star,
  TrendingUp,
  WorkspacePremium,
  Groups,
} from '@mui/icons-material';

interface TeacherReward {
  type: 'cash' | 'academic-credits' | 'certificate' | 'priority-access' | 'networking';
  value: number | string;
  description: string;
  eligibilityMet: boolean;
  estimatedValue?: number;
}

interface RewardHistory {
  id: string;
  type: string;
  amount: number;
  value: number | string;
  description: string;
  date: string;
  status: string;
}

const RewardDashboard = () => {
  const [rewards, setRewards] = useState<TeacherReward[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [totalRewardValue, setTotalRewardValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<TeacherReward | null>(null);
  const [redeemForm, setRedeemForm] = useState({
    amount: '',
    paymentMethod: '',
    institution: '',
    certificateType: '',
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      
      if (data.success) {
        setRewards(data.data.availableRewards);
        setRewardHistory(data.data.rewardHistory);
        setTotalRewardValue(data.data.totalRewardValue);
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to load rewards' });
    } finally {
      setLoading(false);
    }
  };

  const handleRewardRedeem = (reward: TeacherReward) => {
    setSelectedReward(reward);
    setOpenDialog(true);
    setRedeemForm({
      amount: '',
      paymentMethod: '',
      institution: '',
      certificateType: '',
    });
  };

  const submitRedemption = async () => {
    if (!selectedReward) return;

    try {
      const payload: Record<string, string | number> = { rewardType: selectedReward.type };

      if (selectedReward.type === 'cash') {
        payload.amount = parseFloat(redeemForm.amount);
        payload.paymentMethod = redeemForm.paymentMethod;
      } else if (selectedReward.type === 'academic-credits') {
        payload.institution = redeemForm.institution;
      } else if (selectedReward.type === 'certificate') {
        payload.certificateType = redeemForm.certificateType;
      }

      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ type: 'success', message: 'Reward redeemed successfully!' });
        setOpenDialog(false);
        fetchRewards(); // Refresh rewards
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to redeem reward' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to redeem reward' });
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'cash': return <AttachMoney sx={{ color: '#4CAF50' }} />;
      case 'academic-credits': return <School sx={{ color: '#2196F3' }} />;
      case 'certificate': return <EmojiEvents sx={{ color: '#FF9800' }} />;
      case 'priority-access': return <Star sx={{ color: '#9C27B0' }} />;
      case 'networking': return <Groups sx={{ color: '#607D8B' }} />;
      default: return <WorkspacePremium />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'cash': return '#4CAF50';
      case 'academic-credits': return '#2196F3';
      case 'certificate': return '#FF9800';
      case 'priority-access': return '#9C27B0';
      case 'networking': return '#607D8B';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Teacher Rewards</Typography>
        <LinearProgress />
      </Box>
    );
  }

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
        <EmojiEvents sx={{ color: '#FF9800' }} />
        Teacher Rewards
      </Typography>

      {/* Rewards Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <AttachMoney sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
          <Typography variant="h6">Total Reward Value</Typography>
          <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
            ${totalRewardValue}
          </Typography>
        </Card>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <EmojiEvents sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
          <Typography variant="h6">Available Rewards</Typography>
          <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
            {rewards.filter(r => r.eligibilityMet).length}
          </Typography>
        </Card>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <TrendingUp sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
          <Typography variant="h6">Rewards Earned</Typography>
          <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
            {rewardHistory.length}
          </Typography>
        </Card>
      </Box>

      {/* Available Rewards */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Available Rewards
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
        {rewards.map((reward, index) => (
          <Card 
            key={index}
            sx={{ 
              height: '100%',
              border: reward.eligibilityMet ? `2px solid ${getRewardColor(reward.type)}` : '1px solid #e0e0e0',
              opacity: reward.eligibilityMet ? 1 : 0.6,
            }}
          >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {getRewardIcon(reward.type)}
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {reward.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Chip 
                    label={reward.eligibilityMet ? 'Available' : 'Locked'}
                    color={reward.eligibilityMet ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {reward.description}
                </Typography>
                
                {reward.estimatedValue && (
                  <Typography variant="body2" sx={{ color: getRewardColor(reward.type), fontWeight: 'bold', mb: 2 }}>
                    Estimated Value: ${reward.estimatedValue}
                  </Typography>
                )}
                
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!reward.eligibilityMet}
                  onClick={() => handleRewardRedeem(reward)}
                  sx={{ 
                    backgroundColor: reward.eligibilityMet ? getRewardColor(reward.type) : undefined,
                    '&:hover': {
                      backgroundColor: reward.eligibilityMet ? getRewardColor(reward.type) : undefined,
                      opacity: 0.8,
                    }
                  }}
                >
                  Redeem
                </Button>
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Reward History */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 2 }}>
        Reward History
      </Typography>
      <Card>
        <CardContent>
          {rewardHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No rewards redeemed yet
            </Typography>
          ) : (
            rewardHistory.map((reward, index) => (
              <Box key={reward.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getRewardIcon(reward.type)}
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {reward.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(reward.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={reward.status}
                      color={reward.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Value: {typeof reward.value === 'number' ? `$${reward.value}` : reward.value}
                    </Typography>
                  </Box>
                </Box>
                {index < rewardHistory.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Redemption Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Redeem {selectedReward?.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </DialogTitle>
        <DialogContent>
          {selectedReward?.type === 'cash' && (
            <>
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={redeemForm.amount}
                onChange={(e) => setRedeemForm({ ...redeemForm, amount: e.target.value })}
                sx={{ mb: 2, mt: 1 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={redeemForm.paymentMethod}
                  onChange={(e) => setRedeemForm({ ...redeemForm, paymentMethod: e.target.value })}
                >
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {selectedReward?.type === 'academic-credits' && (
            <TextField
              fullWidth
              label="Institution"
              value={redeemForm.institution}
              onChange={(e) => setRedeemForm({ ...redeemForm, institution: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
            />
          )}

          {selectedReward?.type === 'certificate' && (
            <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
              <InputLabel>Certificate Type</InputLabel>
              <Select
                value={redeemForm.certificateType}
                onChange={(e) => setRedeemForm({ ...redeemForm, certificateType: e.target.value })}
              >
                <MenuItem value="basic">Basic Teaching Certificate</MenuItem>
                <MenuItem value="advanced">Advanced Teaching Certificate</MenuItem>
                <MenuItem value="expert">Expert Teaching Certificate</MenuItem>
              </Select>
            </FormControl>
          )}

          <Typography variant="body2" color="text.secondary">
            {selectedReward?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={submitRedemption}
            variant="contained"
            disabled={
              (selectedReward?.type === 'cash' && (!redeemForm.amount || !redeemForm.paymentMethod)) ||
              (selectedReward?.type === 'academic-credits' && !redeemForm.institution) ||
              (selectedReward?.type === 'certificate' && !redeemForm.certificateType)
            }
          >
            Redeem
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RewardDashboard;
