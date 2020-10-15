import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Orphanage from './Orphanage';

@Entity('images')
class Image {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Orphanage, orphanage => orphanage.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orphanage_id' })
  orphanage: Orphanage;
}

export default Image;
