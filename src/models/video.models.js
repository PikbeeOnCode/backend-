import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videofile:{
       type: String, // cloudinary
        required:true,

    },
    thumbnail:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
        trim:true,
        index:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    duration:{
        type:Number, // cloudinary nurl 
        required:true,

    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video =mongoose.model("Video", videoSchema)
        