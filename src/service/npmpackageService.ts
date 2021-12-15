import getRepository from '../storeManager';
import { Npmpackage } from "../entity/npmpackage";

export class NpmpackageService {
  npmpackageRepository: any;
  constructor(){
    getRepository(Npmpackage).then((res) => {
      this.npmpackageRepository = res;
    }).catch(e=>{
      throw new Error(`init npmpackage repo error: ${e}`);
    })
  }

  async insert(param: Npmpackage) {
    await this.npmpackageRepository.save(param);
  }

  async update(param: Npmpackage) {
    await this.npmpackageRepository.save(param);
  }

  async findOne(param?: Npmpackage) {
    if (!param) return null;
    return await this.npmpackageRepository.findOne({name: param.name, version: param.version});
  }
}