// Chat API Testing Utilities
// Use these functions in your frontend to test the chat backend

export class ChatAPI {
  private static baseURL = '/api/chat';

  // 📌 Get all users and conversations
  static async getUsers() {
    try {
      const response = await fetch(`${this.baseURL}/users`);
      const data = await response.json();
      console.log("📌 All users fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  }

  // ✅ Create new conversation
  static async createConversation(otherUserId: string) {
    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otherUserId }),
      });
      const data = await response.json();
      console.log("✅ New conversation created:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      throw error;
    }
  }

  // 💬 Get messages for a conversation
  static async getMessages(conversationId: string) {
    try {
      const response = await fetch(`${this.baseURL}/messages/${conversationId}`);
      const data = await response.json();
      console.log("💬 Messages fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      throw error;
    }
  }

  // 💬 Send a message
  static async sendMessage(conversationId: string, content: string) {
    try {
      const response = await fetch(`${this.baseURL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId, content }),
      });
      const data = await response.json();
      console.log("💬 Message sent:", data);
      return data;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  }

  // 🔄 Poll for updates (conversations or messages)
  static async pollUpdates(conversationId?: string, lastMessageTime?: string) {
    try {
      let url = `${this.baseURL}/poll`;
      const params = new URLSearchParams();
      
      if (conversationId) params.append('conversationId', conversationId);
      if (lastMessageTime) params.append('lastMessageTime', lastMessageTime);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log("🔄 Poll update:", data);
      return data;
    } catch (error) {
      console.error("❌ Error polling updates:", error);
      throw error;
    }
  }

  // 🧪 Test all endpoints
  static async runFullTest() {
    console.log("🧪 Starting Chat API Full Test...");

    try {
      // 1. Get users
      console.log("\n1️⃣ Testing: Get Users");
      const users = await this.getUsers();

      if (users.usersForNewConversation?.length > 0) {
        const testUser = users.usersForNewConversation[0];

        // 2. Create conversation
        console.log("\n2️⃣ Testing: Create Conversation");
        const conversation = await this.createConversation(testUser._id);

        if (conversation.conversationId) {
          // 3. Get messages (should be empty initially)
          console.log("\n3️⃣ Testing: Get Messages (empty)");
          await this.getMessages(conversation.conversationId);

          // 4. Send a test message
          console.log("\n4️⃣ Testing: Send Message");
          await this.sendMessage(conversation.conversationId, "Hello! This is a test message 👋");

          // 5. Get messages again (should have 1 message)
          console.log("\n5️⃣ Testing: Get Messages (with content)");
          await this.getMessages(conversation.conversationId);

          // 6. Test polling
          console.log("\n6️⃣ Testing: Poll for Updates");
          await this.pollUpdates();
          await this.pollUpdates(conversation.conversationId);
        }
      }

      console.log("\n✅ All tests completed successfully!");
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  }
}

// Example usage in your frontend component:
/*
import { ChatAPI } from '@/lib/chatTestUtils';

// Test single endpoint
ChatAPI.getUsers();

// Run full test suite
ChatAPI.runFullTest();

// Set up polling (call every 5 seconds for optimal performance)
setInterval(() => {
  ChatAPI.pollUpdates(); // Poll conversation list
  if (activeConversationId) {
    ChatAPI.pollUpdates(activeConversationId, lastMessageTime);
  }
}, 5000); // 5 seconds instead of 300ms
*/
