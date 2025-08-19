'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
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
  Avatar,
  Rating,
  Divider,
} from '@mui/material';
import {
  School,
  CalendarToday,
  Group,
  Person,
  WorkspacePremium,
  Quiz,
} from '@mui/icons-material';

interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  rating: number;
  sessionsCompleted: number;
  hourlyRate: number;
  reputation: number;
  isAvailable: boolean;
}

interface SessionBooking {
  teacherId: string;
  subject: string;
  sessionType: 'individual' | 'group' | 'premium' | 'exam-prep';
  duration: number;
  scheduledDate: string;
  notes: string;
}

export default function SessionBooking({ teacher, onClose, onBooked }: {
  teacher: Teacher;
  onClose: () => void;
  onBooked: () => void;
}) {
  const [booking, setBooking] = useState<SessionBooking>({
    teacherId: teacher.id,
    subject: '',
    sessionType: 'individual',
    duration: 60,
    scheduledDate: '',
    notes: '',
  });
  const [creditCost, setCreditCost] = useState(2);
  const [userCredits, setUserCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    fetchUserCredits();
  }, []);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      const data = await response.json();
      if (data.success) {
        setUserCredits(data.data.creditInfo.learningCredits + data.data.creditInfo.bonusCredits);
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to fetch credit balance' });
    }
  };

  useEffect(() => {
    const calculateCreditCost = () => {
      let baseCost = Math.ceil(booking.duration / 30); // 1 credit per 30 minutes
      
      switch (booking.sessionType) {
        case 'group':
          baseCost = Math.ceil(baseCost * 0.7); // 30% discount
          break;
        case 'premium':
          baseCost = Math.ceil(baseCost * 1.5); // 50% premium
          break;
        case 'exam-prep':
          baseCost = Math.ceil(baseCost * 1.3); // 30% premium
          break;
      }
      
      setCreditCost(baseCost);
    };
    
    calculateCreditCost();
  }, [booking.duration, booking.sessionType]);

  const handleBookSession = async () => {
    if (!booking.subject || !booking.scheduledDate) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    if (userCredits < creditCost) {
      setAlert({ type: 'error', message: 'Insufficient learning credits' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sessions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({ type: 'success', message: 'Session booked successfully!' });
        onBooked();
        setTimeout(() => onClose(), 2000);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to book session' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to book session' });
    } finally {
      setLoading(false);
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Person />;
      case 'group': return <Group />;
      case 'premium': return <WorkspacePremium />;
      case 'exam-prep': return <Quiz />;
      default: return <School />;
    }
  };

  const getSessionTypeDescription = (type: string) => {
    switch (type) {
      case 'individual': return 'One-on-one personalized session';
      case 'group': return 'Small group session (2-5 students)';
      case 'premium': return 'Advanced session with expert instructor';
      case 'exam-prep': return 'Focused exam preparation session';
      default: return '';
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={teacher.avatar} sx={{ width: 50, height: 50 }}>
            {teacher.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">Book Session with {teacher.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={teacher.rating} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {teacher.sessionsCompleted} sessions completed
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {alert && (
          <Alert 
            severity={alert.type} 
            onClose={() => setAlert(null)}
            sx={{ mb: 3 }}
          >
            {alert.message}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
          {/* Session Details */}
          <Box>
            <Typography variant="h6" gutterBottom>Session Details</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={booking.subject}
                onChange={(e) => setBooking({ ...booking, subject: e.target.value })}
              >
                {teacher.skills.map((skill) => (
                  <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Session Type</InputLabel>
              <Select
                value={booking.sessionType}
                onChange={(e) => setBooking({ ...booking, sessionType: e.target.value as SessionBooking['sessionType'] })}
              >
                <MenuItem value="individual">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Individual Session
                  </Box>
                </MenuItem>
                <MenuItem value="group">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group /> Group Session (30% off)
                  </Box>
                </MenuItem>
                <MenuItem value="premium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkspacePremium /> Premium Session (+50%)
                  </Box>
                </MenuItem>
                <MenuItem value="exam-prep">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Quiz /> Exam Prep (+30%)
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Duration</InputLabel>
              <Select
                value={booking.duration}
                onChange={(e) => setBooking({ ...booking, duration: Number(e.target.value) })}
              >
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={90}>1.5 hours</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Scheduled Date & Time"
              type="datetime-local"
              value={booking.scheduledDate}
              onChange={(e) => setBooking({ ...booking, scheduledDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={3}
              value={booking.notes}
              onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
              placeholder="Any specific topics or requests for this session..."
            />
          </Box>

          {/* Booking Summary */}
          <Box>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Booking Summary</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {getSessionTypeIcon(booking.sessionType)}
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {booking.sessionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getSessionTypeDescription(booking.sessionType)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Duration:</Typography>
                <Typography variant="body2">{booking.duration} minutes</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Base Cost:</Typography>
                <Typography variant="body2">{Math.ceil(booking.duration / 30)} credits</Typography>
              </Box>

              {booking.sessionType !== 'individual' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {booking.sessionType === 'group' ? 'Group Discount:' : 'Premium Fee:'}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: booking.sessionType === 'group' ? 'green' : 'orange' 
                  }}>
                    {booking.sessionType === 'group' ? '-30%' : 
                     booking.sessionType === 'premium' ? '+50%' : '+30%'}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">Total Cost:</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#2196F3' }}>
                  {creditCost} credits
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Your Balance:</Typography>
                <Typography variant="body2" sx={{ 
                  color: userCredits >= creditCost ? 'green' : 'red' 
                }}>
                  {userCredits} credits
                </Typography>
              </Box>

              {userCredits < creditCost && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You need {creditCost - userCredits} more credits to book this session.
                  <Button 
                    size="small" 
                    sx={{ mt: 1 }}
                    href="/dashboard/credits"
                  >
                    Get More Credits
                  </Button>
                </Alert>
              )}
            </Card>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleBookSession}
          variant="contained"
          disabled={loading || userCredits < creditCost || !booking.subject || !booking.scheduledDate}
          startIcon={<CalendarToday />}
        >
          {loading ? 'Booking...' : `Book Session (${creditCost} credits)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

