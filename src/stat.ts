import { Request, Response } from 'express';
import * as fs from 'fs';
import { Logger, IPluginMiddleware, PluginOptions, IBasicAuth, IStorageManager } from '@verdaccio/types';

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
      if (req.method === 'PUT') {
        // publish your package
      } else if (req.method === 'GET' && req.url.indexOf('/-/') !== -1) {
        // install npm package
        console.log(req.get('get package'));
      }
      console.log(req.get('npm-command'));
      console.log(req.url);
      console.log(req.method);
      next();
    });
  }
}
