"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  LiveHelp as LiveHelpIcon,
  ContactSupport as ContactSupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}

interface RecentQuestion {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  avatar?: string;
  askedAt: string;
  isAnswered: boolean;
}

const faqCategories = [
  { id: 'all', name: 'All Categories', icon: <HelpIcon />, color: '#007BFF' },
  { id: 'getting-started', name: 'Getting Started', icon: <SchoolIcon />, color: '#28a745' },
  { id: 'mentorship', name: 'Mentorship', icon: <PeopleIcon />, color: '#6A0DAD' },
  { id: 'courses', name: 'Courses & Learning', icon: <SchoolIcon />, color: '#FF7A00' },
  { id: 'account', name: 'Account & Settings', icon: <SettingsIcon />, color: '#FFC107' },
  { id: 'billing', name: 'Billing & Payments', icon: <PaymentIcon />, color: '#E91E63' },
  { id: 'technical', name: 'Technical Support', icon: <SecurityIcon />, color: '#9C27B0' }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I find the right mentor for my learning goals?',
    answer: 'To find the perfect mentor, use our AI-powered smart search feature in the "Discover Mentors" section. Simply describe what you want to learn (e.g., "I want to learn React for web development"), and our system will match you with mentors who specialize in those areas. You can also filter by experience level, rating, pricing, and availability.',
    category: 'mentorship',
    tags: ['mentor', 'matching', 'AI search'],
    helpful: 45,
    notHelpful: 3
  },
  {
    id: '2',
    question: 'Is SkillForge completely free to use?',
    answer: 'Yes! SkillForge is completely free for learners. You can access all courses, connect with mentors, participate in community discussions, and use all platform features without any cost. Some premium mentors may charge for their services, but there are many free mentoring options available.',
    category: 'billing',
    tags: ['free', 'pricing', 'cost'],
    helpful: 78,
    notHelpful: 2
  },
  {
    id: '3',
    question: 'How do I create an effective learning profile?',
    answer: 'Go to your Profile Settings and fill out all sections completely. Include your current skill level, learning goals, interests, and preferred learning style. Add a professional photo and write a brief bio about your background. The more detailed your profile, the better our AI can match you with relevant mentors and learning opportunities.',
    category: 'getting-started',
    tags: ['profile', 'setup', 'optimization'],
    helpful: 32,
    notHelpful: 1
  },
  {
    id: '4',
    question: 'What should I expect during my first mentorship session?',
    answer: 'Your first session typically includes: introductions and goal setting, assessment of your current skill level, creation of a personalized learning roadmap, discussion of expectations and communication preferences, and scheduling future sessions. Come prepared with specific questions and learning objectives.',
    category: 'mentorship',
    tags: ['first session', 'expectations', 'preparation'],
    helpful: 56,
    notHelpful: 4
  },
  {
    id: '5',
    question: 'How can I track my learning progress?',
    answer: 'Use the "My Progress" section to view your learning dashboard. It shows completed courses, skills acquired, mentorship hours, project milestones, and achievements earned. You can also set learning goals and track your completion rate over time.',
    category: 'courses',
    tags: ['progress', 'tracking', 'dashboard'],
    helpful: 41,
    notHelpful: 2
  },
  {
    id: '6',
    question: 'How do I participate in community discussions?',
    answer: 'Visit the "Forum Discussions" section to browse topics or start new discussions. You can ask questions, share projects for feedback, collaborate on projects, participate in study groups, and engage in skill-specific conversations. Be respectful and constructive in all interactions.',
    category: 'getting-started',
    tags: ['community', 'forum', 'discussions'],
    helpful: 29,
    notHelpful: 1
  },
  {
    id: '7',
    question: 'What if I\'m not satisfied with my mentor?',
    answer: 'We want you to have the best learning experience. If you\'re not satisfied, you can: communicate your concerns directly with your mentor, request a different mentor through our platform, or contact our support team for assistance. We\'ll help you find a better match for your learning style and goals.',
    category: 'mentorship',
    tags: ['mentor change', 'satisfaction', 'support'],
    helpful: 23,
    notHelpful: 1
  },
  {
    id: '8',
    question: 'How do I change my account settings or password?',
    answer: 'Go to "Profile Settings" and click on "Account Security." Here you can update your email, change your password, enable two-factor authentication, and manage privacy settings. Always use a strong, unique password for your account security.',
    category: 'account',
    tags: ['settings', 'password', 'security'],
    helpful: 18,
    notHelpful: 0
  },
  {
    id: '9',
    question: 'Can I access courses offline?',
    answer: 'Currently, our courses require an internet connection to access. However, you can bookmark important resources, take notes in your profile, and download any provided materials for offline study. We\'re working on offline capabilities for future updates.',
    category: 'technical',
    tags: ['offline', 'courses', 'access'],
    helpful: 15,
    notHelpful: 8
  },
  {
    id: '10',
    question: 'How do I report inappropriate behavior in the community?',
    answer: 'We maintain a safe and respectful environment. To report inappropriate behavior: click the "Report" button on any post or message, contact our moderation team directly, or email support@skillforge.com. All reports are reviewed promptly and handled confidentially.',
    category: 'account',
    tags: ['report', 'safety', 'moderation'],
    helpful: 12,
    notHelpful: 0
  }
];

const recentQuestions: RecentQuestion[] = [
  {
    id: '1',
    question: 'Best practices for learning multiple programming languages simultaneously?',
    answer: 'Focus on one language until you\'re comfortable, then gradually introduce others. Look for common concepts between languages to accelerate learning.',
    askedBy: 'Alex Chen',
    avatar: '/alex.png',
    askedAt: '2 hours ago',
    isAnswered: true
  },
  {
    id: '2',
    question: 'How to stay motivated during long-term learning projects?',
    answer: 'Set small, achievable milestones and celebrate progress. Join study groups and share your journey with the community for accountability.',
    askedBy: 'Sarah Johnson',
    avatar: '/sarah.png',
    askedAt: '4 hours ago',
    isAnswered: true
  },
  {
    id: '3',
    question: 'Tips for effective remote mentorship sessions?',
    answer: 'Ensure good internet connection, prepare questions in advance, use screen sharing effectively, and maintain regular communication between sessions.',
    askedBy: 'Mike Rodriguez',
    avatar: '/mike.png',
    askedAt: '6 hours ago',
    isAnswered: true
  },
  {
    id: '4',
    question: 'How to build a portfolio that stands out to employers?',
    answer: '',
    askedBy: 'Emily Davis',
    avatar: '/emily.png',
    askedAt: '1 day ago',
    isAnswered: false
  }
];

export default function QuestionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            ❓ Help & Q&A
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find answers to common questions and get help from our community
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Frequently Asked Questions" 
              icon={<HelpIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Recently Asked" 
              icon={<LiveHelpIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Contact Support" 
              icon={<ContactSupportIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* FAQ Tab */}
        {activeTab === 0 && (
          <>
            {/* Search and Categories */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <TextField
                fullWidth
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {faqCategories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    icon={category.icon}
                    variant={selectedCategory === category.id ? "filled" : "outlined"}
                    color={selectedCategory === category.id ? "primary" : "default"}
                    onClick={() => setSelectedCategory(category.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>

            {/* FAQ List */}
            <Box sx={{ mb: 4 }}>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Accordion
                    expanded={expandedFAQ === faq.id}
                    onChange={handleAccordionChange(faq.id)}
                    sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <QuestionAnswerIcon color="primary" />
                        <Typography variant="h6" fontWeight="medium" sx={{ flex: 1 }}>
                          {faq.question}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {faq.tags.slice(0, 2).map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                        {faq.answer}
                      </Typography>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Was this helpful?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<ThumbUpIcon />}
                            variant="outlined"
                            color="success"
                          >
                            {faq.helpful}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<ThumbDownIcon />}
                            variant="outlined"
                            color="error"
                          >
                            {faq.notHelpful}
                          </Button>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </Box>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <SearchIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No FAQs found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms or browse different categories
                </Typography>
              </Paper>
            )}
          </>
        )}

        {/* Recently Asked Tab */}
        {activeTab === 1 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              🕒 Recently Asked Questions
            </Typography>
            
            {recentQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar src={question.avatar} sx={{ width: 40, height: 40 }}>
                        {question.askedBy.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {question.askedBy}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={question.isAnswered ? "Answered" : "Pending"} 
                              size="small" 
                              color={question.isAnswered ? "success" : "warning"}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {question.askedAt}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                          {question.question}
                        </Typography>
                        
                        {question.isAnswered && question.answer && (
                          <Paper sx={{ p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              💡 Community Answer:
                            </Typography>
                            <Typography variant="body1">
                              {question.answer}
                            </Typography>
                          </Paper>
                        )}
                        
                        {!question.isAnswered && (
                          <Button
                            variant="outlined"
                            startIcon={<QuestionAnswerIcon />}
                            size="small"
                          >
                            Answer This Question
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Contact Support Tab */}
        {activeTab === 2 && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
              mb: 4 
            }}
          >
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <ContactSupportIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Contact Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get personalized help from our team
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    support@skillforge.com
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ChatIcon />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Live Chat (9 AM - 6 PM PST)
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    +1 (555) 123-4567
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  💬 Quick Help
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      🕒 Response Times
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Live Chat: Immediate<br/>
                      • Email: 24-48 hours<br/>
                      • Phone: Business hours
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      🌟 Before Contacting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Check our FAQ section<br/>
                      • Search community discussions<br/>
                      • Try basic troubleshooting
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </motion.div>
    </Container>
  );
}
