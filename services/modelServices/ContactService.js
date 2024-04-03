import Contact from '../../models/Contact.js';
import BaseModelService from './BaseModelService.js';

class ContactService extends BaseModelService {
  defaultSelectFields = '-createdAt -updatedAt -owner';

  getAll(...args) {
    return super.getAll(...args).populate('type', 'name');
  }

  findOne(...args) {
    return super.findOne(...args).populate('type', 'name');
  }
}

export default new ContactService(Contact);
