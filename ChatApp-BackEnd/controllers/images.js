
const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');
const User = require('../models/userModels');

cloudinary.config({ 
    cloud_name: 'dgqaxuar8', 
    api_key: '818873316238487', 
    api_secret: 'ZghJ7pL5Q8a8-AJ-Q6udMACnhnA' 
  });


module.exports ={
    UploadImage (req , res ){
        cloudinary.uploader.upload(req.body.image , async (result) => {
            await User.update({
                _id : req.user._id
            } , {
                $push :{ 
                    images :{
                            imgId : result.public_id,
                            imgVersion : result.version
                        }
                }
            }).then( () => {
                res.status(HttpStatus.OK).json({ message : " Image uploaded successfully"});
            })
            .catch (err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : " Error uploading image"});
        });
        });
    },

  async SetDefaultImage (req , res ){
      const { imageId , imageVersion} = req.params;
      await User.update({
        _id : req.user._id
    } , {
        picId : imageId,
        picVersion : imageVersion
    }).then( () => {
        res.status(HttpStatus.OK).json({ message : " Default Image Set successfully"});
    })
    .catch (err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message : " Error set image"});
});

  }


}