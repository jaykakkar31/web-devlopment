const express=require("express")

const app=express()
const port=9000

const mongoose=require("mongoose")


mongoose.connect(("mongodb://localhost:27017/newDataDB"),{
    useNewUrlPArse:true,
    useUnifedTopology:true
});

const item=new mongoose.Schema({
    name:""
})
const ItemData=mongoose.model("Item",item)

const firstVal= new ItemData({
    name:"Jay"
})



app.get("/",(req,res)=>{
    res.send("Hello world")
    firstVal.save()
})
app.get("/read",(req,res)=>{
    ItemData.find({},(err,data)=>{
        res.send(data)
    })
})



app.listen(port,()=>{

    console.log(`server listens at http://localhost:${port}`)
})