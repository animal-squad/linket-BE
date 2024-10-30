import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    // User 테이블 정보
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    name: string

    @Column()
    photo: string
}
