import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Snap Service')
  .setDescription('The snap API description')
  .setVersion('0.0.1')
  .addTag('snaps')
  .build();
