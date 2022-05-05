const bcrypt = require("bcrypt");
const User = require("../models/user");

class authController {
    //REGISTER
    async registration(req, res) {
        try {
            //password hashing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })

            //save user and respond
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async login(req, res){
        try {
            //checking for existence
            const user = await User.findOne({email: req.body.email});
            if (!user)
                res.status(404).json("user not found");

            //checking password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword)
                res.status(400).json("wrong password");

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = new authController();
