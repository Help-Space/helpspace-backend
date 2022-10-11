import { Request, Response, Router } from "express";
import Post, { IPost } from "models/post";

interface GetByIdParams {
    id: string;
}

type Responses<T, N = string> = NormalResponse<T> | ErrorsResponse<N> | ErrorResponse;

interface NormalResponse<T> {
    data: T
}

interface ErrorsResponse<T>  {
    errors: T[]
}

interface ErrorResponse {
    message: string;
}

const getById = (req: Request<GetByIdParams>, res: Responses<IPost>) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).json({ message: "Id is missing" })
    }
    const post = Post.findById(req.params.id);
    if(!post) {
        return res.status(404).json({ message: "Post not found!" })
    }
    res.status(200).send({ data: post });
}

export const setUpPostRoutes = () => {
    const router = Router();
    router.get("/:id", getById);
    return router;
}