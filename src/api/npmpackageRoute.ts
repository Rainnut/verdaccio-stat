import { Utils } from '../utils';
import * as path from 'path';
import { NpmpackageService } from '../service/npmpackageService';
import { Npmpackage } from '../entity/npmpackage';

const ROUTE = "/-/npmpackage/api";

export class NpmpackageRoute {
  static npmpackageService: NpmpackageService;

  static _packageDetail(storage) {
    return Utils.buildRoute({ storage }, async (name, meta) => {
      const
        distTags = Object.entries(meta['dist-tags']),
        versions = Object.keys(meta.versions),
        tags = distTags.reduce((p, [tag, version]) => (p[version as any] = (p[version as any] || []).concat(tag), p), {});

      return versions.reduce(async (p: any, c) => {
        const arr = await p;
        const pkg = await this.npmpackageService.findOne({ name: name, version: c } as Npmpackage);
        return arr.concat({ version: c, tags: (tags[c] || []).join(', '), name, downloadNum: pkg ? pkg.downloadNum : '' })
      }, []);
    }, 404);
  }

  static register(app, storage) {
    this.npmpackageService = new NpmpackageService();
    app.get(path.posix.join(ROUTE, ':scope?', ':package'), NpmpackageRoute._packageDetail(storage));
  }
}