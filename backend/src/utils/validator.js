const validator=require('validator');

const validate=(data)=>{
    const mandatoryField=['firstName','emailId','password'];

    const IsAllowed= mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!IsAllowed)
        throw new Error ("some field Missing");

}
module.exports=validate;