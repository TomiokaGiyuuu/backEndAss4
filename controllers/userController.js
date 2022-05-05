const bcrypt = require('bcrypt');
const User = require("../models/user");

class userController{
    async check(req, res){
        if(req.body.userId === req.params.id || req.body.isAdmin){
            if(req.body.password){
                try{
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    return res.status(500).json(err);
                }
            }
            try{
                const user = await User.findByIdAndUpdate(req.params.id, {
                   $set: req.body,
                });
                res.status(200).json("Account has been updated!");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json("You can update only your account!");
        }
    }

    async delete(req, res){
        if(req.body.userId === req.params.id || req.body.isAdmin){
            try{
                const user = await User.findByIdAndDelete(req.params.id)
                res.status(200).json("Account has been deleted!");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
            return res.status(403).json("You can delete only your account!");
        }
    }

    async get(req, res){
        const userId = req.query.userId;
        const username = req.query.username;
        try{
            const user = userId
                ? await User.findById(userId)
                : await User.findOne({username: username});
            const {password, updatedAt, ...other} = user._doc;
            res.status(200).json(other);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async follow(req, res){
        if(req.body.userId !== req.params.id){
            try{
                const userToFollow = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if(!userToFollow.followers.includes(req.body.userId)){
                    await userToFollow.updateOne({$push: {followers: req.body.userId}});
                    await currentUser.updateOne({$push: {followings: req.params.id}});
                    res.status(200).json("user has been followed")
                } else {
                    res.status(403).json("you already follow this user")
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json("you cannot follow yourself")
        }
    }

    async unfollow(req, res){
        if(req.body.userId !== req.params.id){
            try{
                const userToUnfollow = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.userId);
                if(userToUnfollow.followers.includes(req.body.userId)){
                    await userToUnfollow.updateOne({$pull: {followers: req.body.userId}});
                    await currentUser.updateOne({$pull: {followings: req.params.id}});
                    res.status(200).json("user has been unfollowed")
                } else {
                    res.status(403).json("you don't follow this user")
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json("you cannot unfollow yourself")
        }
    }
}

module.exports = new userController();