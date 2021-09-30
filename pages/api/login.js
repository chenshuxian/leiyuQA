import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    let id = req.body.id;
    const regist = await prisma.user.findUnique({
        where:{
        id: id
    }, select: {
        phone: true,
        name: true,
        addr: true,
        is_play: true
      },    
    });

    console.log(`login : ${regist}`);

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
