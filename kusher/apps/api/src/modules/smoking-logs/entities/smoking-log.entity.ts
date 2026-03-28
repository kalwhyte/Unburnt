// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   ManyToOne,
// } from 'typeorm';
// import { User } from '@prisma/client';

// @Entity('smoking_logs')
// export class SmokingLog {
//   @PrimaryGeneratedColumn('uuid')
//   id?: string;

//   @Column()
//   userId?: string;

//   @ManyToOne(() => User, (user) => user.smokingLogs)
//   user?: User;

//   @Column({ default: 1 })
//   cigarettes?: number;

//   @Column({ nullable: true })
//   note?: string;

//   @Column({ type: 'timestamp' })
//   smokedAt?: Date;

//   @CreateDateColumn()
//   createdAt?: Date;
// }