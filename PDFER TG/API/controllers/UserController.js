import UserService from '..//services/UserService.js'

class UserController{

    async getAll(req, res) {
         try {
            const User = await UserService.getAll();
            res.json(User);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getOne(req, res) {
        try {
           const User = await UserService.getOne(req.params._id);
           res.json(User);
       } catch (e) {
           res.status(500).json(e);
       }
   }

}

export default new UserController();