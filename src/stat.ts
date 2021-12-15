import "reflect-metadata";
import { Request, Response } from 'express';
import * as fs from 'fs';
import { Logger, IPluginMiddleware, PluginOptions, IBasicAuth, IStorageManager } from '@verdaccio/types';
import { Npmpackage } from "./entity/npmpackage";
import { NpmpackageService } from "./service/npmpackageService";
import { ConfigHttps } from './types';
import { NpmpackageRoute } from './api/NpmpackageRoute';

export default class Https implements IPluginMiddleware<ConfigHttps> {
  enabled: boolean;
  logger: Logger;
  npmpackageService: NpmpackageService;

  constructor(config: ConfigHttps, options: PluginOptions<ConfigHttps>) {
    this.enabled = config.enabled || false;
    this.logger = options.logger;
    this.npmpackageService = new NpmpackageService();
  }

  // req.method req.get('npm-command') req.url
  // 前端资源请求
  // GET undefined /-/static/Dist.9adbe059a74ff4e2d469.js
  // GET undefined /-/pacman/web/login/index.html
  // cli请求
  // GET install /@zer%2fzer-verdaccio-server-demo
  // GET install /@zer%2fzer-verdaccio-server-demo/-/zer-verdaccio-server-demo-1.0.7.tgz
  // PUT publish /@zer%2fzer-verdaccio-server-demo
  register_middlewares(app: any, auth: any, storage: any) {
    app.use(async (req: Request, res: Response, next: any) => {
      const command = req.get('npm-command');
      const flag = req.url.indexOf('/-/');
      if (flag === 0) {
        // 前端请求
      } else {
        // cli请求
        if (flag !== -1 && req.method === 'GET' && command === 'install') {
          const pathArr = decodeURIComponent(req.url).split('/-/');
          const reg = /(\d+\.\d+\.\d+.*)\.tgz/;
          const result = reg.exec(pathArr[1]);
          // 下载安装包，判断数据库是否存在该版本记录，没有新增记录，有则下载量+1
          const pkg = new Npmpackage();
          pkg.name = pathArr[0].substr(1);
          pkg.version = result ? result[1] : '';
          const data = await this.npmpackageService.findOne(pkg);
          if (!data) {
            pkg.downloadNum = 1;
            this.npmpackageService.insert(pkg);
            console.log('insert', pkg);
          } else {
            data.downloadNum = data.downloadNum + 1;
            this.npmpackageService.update(data);
            console.log('update', data);
          }
        } else if (flag === -1 && req.method === 'PUT' && command === 'publish') {
          // publish，新增版本记录（请求中没拿到版本，tag信息）
        }
      }
      next();
    });

    // 添加后端接口
    NpmpackageRoute.register(app, storage);
  }
}
