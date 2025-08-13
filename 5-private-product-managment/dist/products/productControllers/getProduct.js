export default async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            where: { user_id: req.user.id },
        });
        res.json(products);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
