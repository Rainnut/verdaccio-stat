import * as fs from 'fs';
import * as path from 'path';
// noinspection JSUnusedGlobalSymbols
export class Utils {
  /**
   * @param {object} config
   * @return {{enabled: boolean, protectedTags: string[], selectorHomeBtn: string, selectorPacmanBtn: string}}
   */
  static validateConfig(config) {
    config = typeof config === "object" ? config : {};

    const fields = [
      "enabled",
      "protectedTags",
      "selectorHomeBtn",
      "selectorPacmanBtn",
      "injectMode",
      "pageSize",
    ];

    Object.keys(config).forEach((k) => !fields.includes(k) && delete config[k]);

    config.pageSize = ~~config.pageSize;

    typeof config.enabled !== "boolean" && delete config.enabled;
    !Array.isArray(config.protectedTags) && delete config.protectedTags;
    typeof config.selectorHomeBtn !== "string" && delete config.selectorHomeBtn;
    typeof config.selectorPacmanBtn !== "string" &&
      delete config.selectorPacmanBtn;
    !["append", "prepend"].includes(config.injectMode) &&
      delete config.injectMode;
    ![5, 10, 15, 25, 50, 100].includes(config.pageSize) &&
      delete config.pageSize;

    return config;
  }

  /**
   * @param {{getPackage: function}} storage
   * @param {string} module
   * @return {Promise<{name: string, versions: object, tags: object, time: object}>}
   */
  static getPackage(storage, module) {
    return new Promise((ok, nok) => {
      storage.getPackage({
        name: module,
        callback: (err, metaData) => {
          if (err) {
            return nok(err);
          }

          const { name, versions, time, "dist-tags": tags } = metaData;

          ok({ name, versions, time, "dist-tags": tags });
        },
      });
    });
  }

  /**
   * @param {{getLocalDatabase: function}} storage
   * @return {Promise<{name: string, version: string}[]>}
   */
  static getLocalDatabase(storage) {
    return new Promise((ok, nok) =>
      storage.getLocalDatabase((err, packages) =>
        err ? nok(err) : ok(packages)
      )
    );
  }

  /**
   * @param {{changePackage: function}} storage
   * @param {string} module
   * @param {object} meta
   * @return {Promise}
   */
  static changePackage(storage, module, meta) {
    return new Promise((ok, nok) =>
      storage.changePackage(module, meta, "", (err) => (err ? nok(err) : ok()))
    );
  }

  /**
   * @param {*} args
   * @param {function} callback
   * @param {number} errorCode
   * @return {function(*=, *): Promise<void>}
   */
  static buildRoute(args, callback, errorCode = 500) {
    return async (req, res) => {
      const { storage, ...params } = args;

      try {
        const { package: pkg='', scope='' } = req.params || {},
          module = [].concat(scope || [], [pkg as never]).join("/"),
          meta =
            module && storage ? await Utils.getPackage(storage, module) : null;

        const data = await callback(module, meta, req, params);

        data ? res.send(data) : res.sendStatus(200);
      } catch (err) {
        res.sendStatus(errorCode);
      }
    };
  }

  /**
   * @param {object} meta
   * @param {string} version
   * @return {*}
   */
  static getTagsOfVersion(meta, version) {
    return Object.entries(meta["dist-tags"]).reduce(
      (p, [tag, ver]) => (ver === version ? p.concat(tag as never) : p),
      []
    );
  }

  /**
   * @param {string[]} tags
   * @param {object} meta
   * @param {string} version
   * @param {{protectedTags: []}} opts
   * @return {boolean}
   */
  static protectedTagsPreserved(tags, meta, version, opts) {
    const { protectedTags } = opts,
      before = Utils.getTagsOfVersion(meta, version);

    return before
      .filter((t) => protectedTags.includes(t))
      .every((t) => tags.includes(t));
  }
}