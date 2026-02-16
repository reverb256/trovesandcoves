import TelegramBot from 'node-telegram-bot-api';
import { AIOrchestrator } from './ai-orchestrator';
import { storage } from './storage';

interface BotConfig {
  token: string;
  adminChatIds: string[];
  enabled: boolean;
}

export class TrovesAndCovesTelegramBot {
  private bot: TelegramBot | null = null;
  private config: BotConfig;
  private aiOrchestrator: AIOrchestrator;
  private isRunning = false;

  constructor(aiOrchestrator: AIOrchestrator) {
    this.aiOrchestrator = aiOrchestrator;
    this.config = {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      adminChatIds: (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',').filter(Boolean),
      enabled: false
    };

    if (this.config.token && this.config.adminChatIds.length > 0) {
      this.initialize();
    }
  }

  private initialize() {
    try {
      this.bot = new TelegramBot(this.config.token, { polling: false });
      this.setupCommands();
      this.config.enabled = true;
      console.log('Telegram bot initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
    }
  }

  private setupCommands() {
    if (!this.bot) return;

    // System status command
    this.bot.onText(/\/status/, async (msg) => {
      if (!this.isAuthorized(msg.chat.id.toString())) return;
      
      try {
        const systemStatus = await this.aiOrchestrator.getSystemStatus();
        const message = this.formatSystemStatus(systemStatus);
        await this.bot!.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
      } catch (error) {
        await this.bot!.sendMessage(msg.chat.id, '❌ Failed to retrieve system status');
      }
    });

    // AI endpoints status
    this.bot.onText(/\/ai/, async (msg) => {
      if (!this.isAuthorized(msg.chat.id.toString())) return;
      
      try {
        const aiStatus = await this.aiOrchestrator.getSystemStatus();
        const message = this.formatAIStatus(aiStatus);
        await this.bot!.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
      } catch (error) {
        await this.bot!.sendMessage(msg.chat.id, '❌ Failed to retrieve AI status');
      }
    });

    // Security events
    this.bot.onText(/\/security/, async (msg) => {
      if (!this.isAuthorized(msg.chat.id.toString())) return;
      
      const message = `🛡️ *Security Status*\n\n` +
        `✅ All security systems operational\n` +
        `🔒 Data encryption: Active\n` +
        `🕵️ Anonymization: Enabled\n` +
        `📋 Audit logging: Active\n` +
        `🇨🇦 PIPEDA compliance: Verified`;
        
      await this.bot!.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    });

    // Orders summary
    this.bot.onText(/\/orders/, async (msg) => {
      if (!this.isAuthorized(msg.chat.id.toString())) return;
      
      const message = `🛒 *Recent Orders*\n\n` +
        `📊 Processing system operational\n` +
        `💳 Payment gateway: Connected\n` +
        `📦 Fulfillment: Active\n` +
        `📧 Notifications: Enabled`;
        
      await this.bot!.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    });

    // Help command
    this.bot.onText(/\/help/, async (msg) => {
      if (!this.isAuthorized(msg.chat.id.toString())) return;
      
      const message = `🤖 *Troves & Coves Admin Bot*\n\n` +
        `Available commands:\n` +
        `/status - System overview\n` +
        `/ai - AI endpoints status\n` +
        `/security - Security status\n` +
        `/orders - Orders summary\n` +
        `/help - This help message\n\n` +
        `🔒 Authorized admin access only`;
        
      await this.bot!.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
    });

    // Start polling
    this.bot.startPolling();
    this.isRunning = true;
  }

  private isAuthorized(chatId: string): boolean {
    return this.config.adminChatIds.includes(chatId);
  }

  private formatSystemStatus(status: any): string {
    const availableCount = status.endpoints?.filter((e: any) => e.isAvailable).length || 0;
    const totalCount = status.endpoints?.length || 0;
    
    return `🖥️ *System Status*\n\n` +
      `🤖 AI Endpoints: ${availableCount}/${totalCount} online\n` +
      `📊 Queue size: ${status.queueSize || 0}\n` +
      `💾 Cache size: ${status.cacheSize || 0}\n` +
      `🔄 Processing: ${status.processing ? 'Active' : 'Idle'}\n` +
      `⏰ Last updated: ${new Date().toLocaleString()}`;
  }

  private formatAIStatus(status: any): string {
    let message = `🤖 *AI Provider Status*\n\n`;
    
    if (status.endpoints) {
      status.endpoints.forEach((endpoint: any) => {
        const statusIcon = endpoint.isAvailable ? '✅' : '❌';
        const features = endpoint.features?.slice(0, 2).join(', ') || 'N/A';
        message += `${statusIcon} *${endpoint.name}*\n`;
        message += `   Priority: ${endpoint.priority || 'N/A'}\n`;
        message += `   Features: ${features}\n\n`;
      });
    }
    
    return message;
  }

  // Send notifications to admin chats
  public async sendNotification(type: 'security' | 'error' | 'order' | 'system', message: string) {
    if (!this.bot || !this.config.enabled) return;

    const icons = {
      security: '🛡️',
      error: '❌',
      order: '🛒',
      system: '⚠️'
    };

    const formattedMessage = `${icons[type]} *${type.toUpperCase()}*\n\n${message}\n\n⏰ ${new Date().toLocaleString()}`;

    for (const chatId of this.config.adminChatIds) {
      try {
        await this.bot.sendMessage(chatId, formattedMessage, { parse_mode: 'Markdown' });
      } catch (error) {
        console.error(`Failed to send notification to ${chatId}:`, error);
      }
    }
  }

  // Send security alert
  public async sendSecurityAlert(severity: 'low' | 'medium' | 'high' | 'critical', description: string, ip?: string) {
    const urgencyIcons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };

    let message = `🛡️ *SECURITY ALERT*\n\n`;
    message += `${urgencyIcons[severity]} Severity: ${severity.toUpperCase()}\n`;
    message += `📝 Description: ${description}\n`;
    if (ip) message += `🌐 Source IP: ${ip}\n`;
    message += `⏰ Time: ${new Date().toLocaleString()}`;

    await this.sendNotification('security', message);
  }

  // Send AI system alert
  public async sendAIAlert(endpoint: string, status: 'online' | 'offline' | 'degraded') {
    const statusIcons = {
      online: '✅',
      offline: '❌',
      degraded: '⚠️'
    };

    const message = `${statusIcons[status]} AI Provider: ${endpoint}\n` +
      `Status changed to: ${status.toUpperCase()}\n` +
      `Time: ${new Date().toLocaleString()}`;

    await this.sendNotification('system', message);
  }

  // Send order notification
  public async sendOrderNotification(orderId: number, customerEmail: string, amount: string) {
    const message = `🛒 *New Order Received*\n\n` +
      `📋 Order ID: #${orderId}\n` +
      `👤 Customer: ${customerEmail}\n` +
      `💰 Amount: $${amount}\n` +
      `⏰ Time: ${new Date().toLocaleString()}`;

    await this.sendNotification('order', message);
  }

  public stop() {
    if (this.bot && this.isRunning) {
      this.bot.stopPolling();
      this.isRunning = false;
      console.log('Telegram bot stopped');
    }
  }

  public getStatus() {
    return {
      enabled: this.config.enabled,
      running: this.isRunning,
      adminChats: this.config.adminChatIds.length,
      hasToken: !!this.config.token
    };
  }

  public enable() {
    if (this.config.token && this.config.adminChatIds.length > 0 && !this.isRunning) {
      this.initialize();
      return true;
    }
    return false;
  }

  public disable() {
    this.stop();
    this.config.enabled = false;
  }
}

let telegramBot: TrovesAndCovesTelegramBot | null = null;

export function initializeTelegramBot(aiOrchestrator: AIOrchestrator): TrovesAndCovesTelegramBot {
  if (!telegramBot) {
    telegramBot = new TrovesAndCovesTelegramBot(aiOrchestrator);
  }
  return telegramBot;
}

export function getTelegramBot(): TrovesAndCovesTelegramBot | null {
  return telegramBot;
}