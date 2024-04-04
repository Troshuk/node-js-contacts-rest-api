import ContactType from '../../models/ContactType.js';
import BaseModelService from './BaseModelService.js';

class ContactTypeService extends BaseModelService {
  defaultSelectFields = '-owner';
}

export default new ContactTypeService(ContactType);
