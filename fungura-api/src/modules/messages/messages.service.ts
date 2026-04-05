import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly msgRepo: Repository<Message>) {}

  async getContacts(userId: string) {
    // Get distinct contacts with last message
    const contacts = await this.msgRepo.createQueryBuilder('m')
      .select('CASE WHEN m.senderId = :userId THEN m.receiverId ELSE m.senderId END', 'contactid')
      .addSelect('MAX(m.createdAt)', 'lastMessageAt')
      .where('m.senderId = :userId OR m.receiverId = :userId', { userId })
      .groupBy('contactid')
      .orderBy('"lastMessageAt"', 'DESC')
      .getRawMany();
    return contacts;
  }

  async getConversation(userId: string, contactId: string) {
    return this.msgRepo.find({
      where: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(senderId: string, receiverId: string, text: string, attachmentUrl?: string): Promise<Message> {
    const msg = this.msgRepo.create({ senderId, receiverId, text, attachmentUrl });
    return this.msgRepo.save(msg);
  }

  async markAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.msgRepo.createQueryBuilder()
      .update(Message)
      .set({ read: true })
      .where('senderId = :senderId AND receiverId = :receiverId AND read = false', { senderId, receiverId })
      .execute();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.msgRepo.count({ where: { receiverId: userId, read: false } });
  }
}
