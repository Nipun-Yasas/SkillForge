"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
} from "@mui/material";
import {
  School,
  EmojiEvents,
  Star,
  TrendingUp,
  AccountBalanceWallet,
  SwapHoriz,
  Add,
  Remove,
} from "@mui/icons-material";
import CreditsSkeleton from "./components/CreditsSkeleton";

interface CreditInfo {
  teachingCredits: number;
  learningCredits: number;
  bonusCredits: number;
  reputation: number;
  level: "bronze" | "silver" | "gold" | "platinum";
  totalEarned: number;
  totalSpent: number;
  achievements: string[];
}

interface Transaction {
  id: string;
  type: "earned" | "spent" | "bonus" | "transfer";
  amount: number;
  creditType: "teaching" | "learning" | "bonus";
  description: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

const CreditDashboard = () => {
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [transferForm, setTransferForm] = useState({
    recipientEmail: "",
    amount: "",
    message: "",
  });
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchCreditInfo();
  }, []);

  const fetchCreditInfo = async () => {
    try {
      // This would be your actual API endpoint
      const response = await fetch("/api/credits");
      const data = await response.json();

      if (data.success) {
        setCreditInfo(data.data.creditInfo);
        setTransactions(data.data.transactions);
      }
    } catch {
      setAlert({ type: "error", message: "Failed to load credit information" });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferCredits = async () => {
    try {
      const response = await fetch("/api/credits/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: transferForm.recipientEmail,
          amount: parseFloat(transferForm.amount),
          message: transferForm.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          type: "success",
          message: "Credits transferred successfully!",
        });
        setOpenTransferDialog(false);
        setTransferForm({ recipientEmail: "", amount: "", message: "" });
        fetchCreditInfo(); // Refresh credit info
      } else {
        setAlert({
          type: "error",
          message: data.error || "Failed to transfer credits",
        });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to transfer credits" });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "#CD7F32";
      case "silver":
        return "#C0C0C0";
      case "gold":
        return "#FFD700";
      case "platinum":
        return "#E5E4E2";
      default:
        return "#757575";
    }
  };

  const getLevelProgress = (reputation: number) => {
    if (reputation < 25) return (reputation / 25) * 100;
    if (reputation < 50) return ((reputation - 25) / 25) * 100;
    if (reputation < 75) return ((reputation - 50) / 25) * 100;
    return ((reputation - 75) / 25) * 100;
  };

  const getNextLevel = (level: string) => {
    switch (level) {
      case "bronze":
        return "silver";
      case "silver":
        return "gold";
      case "gold":
        return "platinum";
      case "platinum":
        return "max";
      default:
        return "bronze";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <Add sx={{ color: "#4CAF50" }} />;
      case "spent":
        return <Remove sx={{ color: "#f44336" }} />;
      case "bonus":
        return <Star sx={{ color: "#FF9800" }} />;
      case "transfer":
        return <SwapHoriz sx={{ color: "#2196F3" }} />;
      default:
        return <AccountBalanceWallet />;
    }
  };

  if (loading) {
    return (
      <CreditsSkeleton />
    );
  }

  if (!creditInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load credit information</Alert>
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

      {/* Credit Overview */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ textAlign: "center", p: 2 }}>
          <School sx={{ fontSize: 40, color: "#4CAF50", mb: 1 }} />
          <Typography variant="h6">Teaching Credits</Typography>
          <Typography
            variant="h4"
            sx={{ color: "#4CAF50", fontWeight: "bold" }}
          >
            {creditInfo.teachingCredits}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Earned from teaching sessions
          </Typography>
        </Card>

        <Card sx={{ textAlign: "center", p: 2 }}>
          <EmojiEvents sx={{ fontSize: 40, color: "#2196F3", mb: 1 }} />
          <Typography variant="h6">Learning Credits</Typography>
          <Typography
            variant="h4"
            sx={{ color: "#2196F3", fontWeight: "bold" }}
          >
            {creditInfo.learningCredits}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available for learning sessions
          </Typography>
        </Card>

        <Card sx={{ textAlign: "center", p: 2 }}>
          <Star sx={{ fontSize: 40, color: "#FF9800", mb: 1 }} />
          <Typography variant="h6">Bonus Credits</Typography>
          <Typography
            variant="h4"
            sx={{ color: "#FF9800", fontWeight: "bold" }}
          >
            {creditInfo.bonusCredits}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Special rewards and achievements
          </Typography>
        </Card>
      </Box>

      {/* Level & Reputation */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUp />
            Level & Reputation
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Chip
              label={creditInfo.level.toUpperCase()}
              sx={{
                backgroundColor: getLevelColor(creditInfo.level),
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: getLevelColor(creditInfo.level),
                fontWeight: "bold",
              }}
            >
              Reputation: {creditInfo.reputation}/100
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                Progress to {getNextLevel(creditInfo.level)} level
              </Typography>
              <Typography variant="body2">
                {creditInfo.reputation}/100
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={getLevelProgress(creditInfo.reputation)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Total Sessions: {creditInfo.totalEarned} taught • Achievements:{" "}
            {creditInfo.achievements.length}
          </Typography>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<SwapHoriz />}
              onClick={() => setOpenTransferDialog(true)}
              disabled={creditInfo.teachingCredits < 1}
            >
              Transfer Credits
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmojiEvents />}
              href="/dashboard/rewards"
            >
              View Rewards
            </Button>
            <Button
              variant="outlined"
              startIcon={<School />}
              href="/findmentor"
            >
              Find Mentors
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          {transactions.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              No transactions yet
            </Typography>
          ) : (
            transactions.slice(0, 10).map((transaction, index) => (
              <Box key={transaction.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {getTransactionIcon(transaction.type)}
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {transaction.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()} •{" "}
                        {transaction.creditType} credits
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        color:
                          transaction.type === "earned" ||
                          transaction.type === "bonus"
                            ? "#4CAF50"
                            : "#f44336",
                      }}
                    >
                      {transaction.type === "spent" ? "-" : "+"}
                      {transaction.amount}
                    </Typography>
                    <Chip
                      label={transaction.status}
                      color={
                        transaction.status === "completed"
                          ? "success"
                          : transaction.status === "pending"
                            ? "warning"
                            : "error"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                {index < transactions.length - 1 && index < 9 && <Divider />}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Transfer Credits Dialog */}
      <Dialog
        open={openTransferDialog}
        onClose={() => setOpenTransferDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Transfer Credits</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Recipient Email"
            value={transferForm.recipientEmail}
            onChange={(e) =>
              setTransferForm({
                ...transferForm,
                recipientEmail: e.target.value,
              })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={transferForm.amount}
            onChange={(e) =>
              setTransferForm({ ...transferForm, amount: e.target.value })
            }
            sx={{ mb: 2 }}
            inputProps={{ max: creditInfo.teachingCredits, min: 1 }}
          />
          <TextField
            fullWidth
            label="Message (optional)"
            multiline
            rows={3}
            value={transferForm.message}
            onChange={(e) =>
              setTransferForm({ ...transferForm, message: e.target.value })
            }
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Available teaching credits: {creditInfo.teachingCredits}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransferDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTransferCredits}
            variant="contained"
            disabled={
              !transferForm.recipientEmail ||
              !transferForm.amount ||
              parseFloat(transferForm.amount) > creditInfo.teachingCredits ||
              parseFloat(transferForm.amount) < 1
            }
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreditDashboard;
