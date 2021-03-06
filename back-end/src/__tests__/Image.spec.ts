import request from 'supertest';
import createConnection from '@shared/infra/typeorm';
import path from 'path';
import { Connection, getConnection } from 'typeorm';
import Image from '@modules/orphanages/infra/typeorm/entities/Image';
import imageViews from '@modules/orphanages/infra/http/views/images_view';
import { container } from 'tsyringe';
import CreateUsersService from '@modules/users/services/CreateUsersService';

import app from '../shared/infra/http/app';
import truncate from './config/truncate';
import { useOrphanage, userFactory } from './config/factories';
import truncateImages from './config/truncate_images';

const image = path.join(__dirname, '..', '..', 'uploads', 'baixados.png');
let connection: Connection;

describe('Images Orphanage', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    await truncateImages();
    const myConnection = getConnection();
    await connection.close();
    await myConnection.close();
  });

  it('should delete image with valid id', async () => {
    const userFac = await userFactory({});
    const userService = container.resolve(CreateUsersService);
    const user = await userService.execute(userFac);

    const orphanageFactory = await useOrphanage();
    const resOrphanage = await request(app)
      .post('/api/v1/orphanages')
      .field('name', orphanageFactory.name)
      .field('latitude', orphanageFactory.latitude)
      .field('longitude', orphanageFactory.longitude)
      .field('about', orphanageFactory.about)
      .field('instructions', orphanageFactory.instructions)
      .field('opening_hours', orphanageFactory.opening_hours)
      .field('open_on_weekends', orphanageFactory.open_on_weekends)
      .field('approved', orphanageFactory.approved)
      .attach('images', image)
      .set('Authorization', `Bearer ${user.authentication}`);

    const photos: Image[] = resOrphanage.body.images;

    const response = await request(app)
      .delete(`/api/v1/orphanages/image/${photos[0].id}`)
      .set('Authorization', `Bearer ${user.authentication}`);

    expect(response.status).toBe(204);
  });

  it('should not delete image with invalid id', async () => {
    const userFac = await userFactory({});
    const userService = container.resolve(CreateUsersService);
    const user = await userService.execute(userFac);

    const id = 5784578;
    const response = await request(app)
      .delete(`'/api/v1/orphanages/image/${id}`)
      .set('Authorization', `Bearer ${user.authentication}`);

    expect(response.status).toBe(400);
  });

  it('should return only the information determined by the image view(render one)', async () => {
    const newImage = new Image();
    newImage.id = 10;
    newImage.path = '141411.png';

    const imageView = imageViews.render(newImage);

    expect(imageView).toHaveProperty('id');
    expect(imageView).toHaveProperty('path');
  });
});
