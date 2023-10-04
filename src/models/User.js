const mongoose=require('mongoose')
const userColecction="users"

//Crear un Schema de la collection a utilizar en mongo
const userShema= new mongoose.Schema({
    first_name:{type:String,required:true,max:10},
    last_name:{type:String,required:true,max:10},
    email:{type:String,required:true,max:20},
    age:{type:String,required:true,max:100},
    password:{type:String,required:true,max:20},
    cart:String,
    role:String
})



//Creación del modelo
const Users=mongoose.model(userColecction,userShema)

//Exportar el modulo
module.exports=Users