const {Tag} = require('../models')

class TagController {
    static async findAllTag(req, res){
        try {
            const data = await Tag.findAll()
            res.status(200).json({message: 'Found', data})
        } catch (error) {
            console.log(error)
        }
    }

    static async createTag(req, res) {
        try {
            const {tag_name} = req.body
            const data = await Tag.create({tag_name})
            if (data) {
                res.status(202).json({message: 'Created', data})
            } else {
                res.status(404).json({message: 'Something wrong Cant create'})
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = TagController