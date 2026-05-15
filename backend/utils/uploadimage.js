const cloudinary = require('cloudinary').v2;

async function uploadimage(imagepath) {
    try {
        const result = await cloudinary.uploader.upload(imagepath, {
            folder: "blog app"
        });
       return{
        secure_url: result.secure_url,
        public_id: result.public_id
       }; 
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        throw err;
    }
}

 
async function deleteimagefromcloud(imageid){
    try{
        await cloudinary.uploader.destroy(imageid);

    }catch(err)
    {
        console.log(err);
    }

}

module.exports = {uploadimage,deleteimagefromcloud};