import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function getValidateFn<T extends object>(
  type: ClassConstructor<T>
): (config: Record<string, unknown>) => T | undefined {
  return (config: Record<string, unknown>) => {
    if (config['NODE_ENV'] === 'test') return undefined;
    const validatedConfig = plainToInstance(type, config, { enableImplicitConversion: true });

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  };
}
