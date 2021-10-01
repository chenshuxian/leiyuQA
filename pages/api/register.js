import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    let {id,name,phone,addr} = req.body;
    const regist = await prisma.user.update({
        where:{
        id: id
        }, 
        data: {
            name,
            phone,
            addr
        }, 
    });

    console.log(`update : ${regist}`);

    let resdata = { success: false };

    if(regist !== null) {
        resdata = {
            success: true,
            data: {
                name: regist.name,
                phone: regist.phone,
                addr: regist.addr,
                is_play: regist.is_play
            }
        }
    } 

    res.send(
        resdata
    )
}
