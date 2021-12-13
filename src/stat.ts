import { Request, Response } from 'express';
import { Logger, IPluginMiddleware, PluginOptions } from '@verdaccio/types';

import { ConfigHttps } from './types';

export default class Https implements IPluginMiddleware<ConfigHttps> {
  enabled: boolean;
  logger: Logger;

  constructor(config: ConfigHttps, options: PluginOptions<ConfigHttps>) {
    this.enabled = config.enabled || false;
    this.logger = options.logger;
  }

  register_middlewares(app: any) {
    app.use((req: Request, res: Response, next: any) => {
      const xproto = req.header('x-forwarded-proto');
      console.log('verdaccio-stat', req, res);
      next();
    });
  }
}
