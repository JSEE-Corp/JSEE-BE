import express, {
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import multer from "multer";
import filter from "./filter/filter";
import cors from 'cors'

const app = express();
const upload = multer({ dest: "uploads/" });
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const groupController = require("./controllers/groupController");
const groupInstance = new groupController();
const postController = require("./controllers/postController");
const postInstance = new postController();
const commentController = require("./controllers/commentController");
const commentInstance = new commentController();

// Async handler helper
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// group
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("get");
    res.status(200).send("Success");
  })
);

router
  .route("/api/groups")
  .get(filter.groupVerify, asyncHandler(groupInstance.groupGetList))
  .post(filter.groupVerify, asyncHandler(groupInstance.groupPost));

router
  .route("/api/groups/:groupId")
  .get(filter.groupVerify, asyncHandler(groupInstance.groupGetDetail))
  .put(filter.groupVerify, asyncHandler(groupInstance.groupPut))
  .delete(filter.groupPasswordVerify, asyncHandler(groupInstance.groupDelete));

router.post(
  "/api/groups/:groupId/verify-password",
  filter.groupPasswordVerify,
  asyncHandler(groupInstance.groupVerifyPassword)
);
router.post("/api/groups/:groupId/like", asyncHandler(groupInstance.groupLike));
router.get(
  "/api/groups/:groupId/is-public",
  asyncHandler(groupInstance.groupIsPublic)
);

// post
router
  .route("/api/groups/:groupId/posts")
  .get(filter.postVerify, asyncHandler(postInstance.postGetList))
  .post(filter.postVerify, asyncHandler(postInstance.postPost));

router
  .route("/api/posts/:postId")
  .get(filter.postIdVerify, asyncHandler(postInstance.postGetDetail))
  .put(filter.postVerify, asyncHandler(postInstance.postPut))
  .delete(filter.postPasswordVerify, asyncHandler(postInstance.postDelete));

router.post(
  "/api/posts/:postId/verify-password",
  filter.postPasswordVerify,
  asyncHandler(postInstance.postVerifyPassword)
);
router.post(
  "/api/posts/:postId/like",
  asyncHandler(postInstance.postLike),
  filter.notFound
);
router.get(
  "/api/posts/:postId/is-public",
  asyncHandler(postInstance.postIsPublic)
);

// comment
router
  .route("/api/posts/:postId/comments")
  .get(filter.commentVerify, asyncHandler(commentInstance.commentGetList))
  .post(filter.commentVerify, asyncHandler(commentInstance.commentPost));

router
  .route("/api/comments/:commentId")
  .put(filter.commentVerify, asyncHandler(commentInstance.commentPut))
  .delete(
    filter.commentPasswordVerify,
    asyncHandler(commentInstance.commentDelete)
  );

// error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error: ", err);
  res.status(500).json({ message: "Internal server error" });
});

app.use(filter.notFound);

app.listen(3000, () => {
  console.log("Server running on port 3000!");
});
