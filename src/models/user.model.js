import mongoose,{Schema} from "mongoose"
import mongooseAggregatedPaginate from "mongoose-aggregate-paginate-v2"
import jwt from "jsonwebtoken"
// todo : jwt is a bearer token. in simple language if someone has jwt we will give data
const userSchema = new Schema({
    username: {
         type: String, 
         required: true,
         unique : true,
         lowercase : true,
         trim :true,
         index: true  // todo :  important for search functionality 
        },
    email : {
        type : String,
        required : true,
        unique : true,
        trim: true,
    },

    fullname:{
        type : String,
        requird: true,
        trim : true,
        index: true
    },
    avatar : {
        type: String, // todo: cloudinary url
        required : true
    },
    coverImage : {
        type: String, // todo: cloudinary url
    },
    watchHistory :[
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password: {
        type: String,
        required: [true,"password is mendetory"]
    },
    refreshToken : {
        type :String
    }
},{
    timestamps : true
})

userSchema.pre("save",async  function(next){
    if(!this.isModified("password")) return next(); // todo:  It will make sure that the password is encrypted only at the time of modification
  this.password = bcrypt.hash(this.password ,10)
  next();
}) // ! Don't use arrow function inside callback of pre hooks as it does't have ref of this


//* Method to check if the user password is correct or not 
userSchema.methods.isPaawordCorrect = async function(enteredPassword ){
    return await bcrypt.compare(enteredPassword , this.password )
}

//*  Generate and retun a new Refresh Token
userSchema.methods.getRefreshToken = function(){
    return jwt.sign({
        _id : this._id,

    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
    )
}

//* Generate and return new  Access token
userSchema.methods.getAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
    )
}


export const User = mongoose.model("User",userSchema)