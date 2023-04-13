import User from '../models/User.js'

class UserService {

    async getAll() {
        const _User = await User.find();
        return _User;
    }

    async getOne(_id) {
        const _User = await User.findById({_id});
        return _User;
    }
}

export default new UserService();