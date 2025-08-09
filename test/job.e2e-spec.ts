import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('JobHttpController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/job-offers (GET)', () => {
    it('should return a paginated list of job offers', () => {
      return request(app.getHttpServer())
        .get('/job-offers')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('list');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('pageSize');
          expect(Array.isArray(res.body.list)).toBe(true);
        });
    });

    it('should return a paginated list of job offers with query params', () => {
      return request(app.getHttpServer())
        .get('/job-offers?page=1&pageSize=5&city=Tehran')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('list');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('pageSize', 5);
          expect(Array.isArray(res.body.list)).toBe(true);
        });
    });
  });
});
