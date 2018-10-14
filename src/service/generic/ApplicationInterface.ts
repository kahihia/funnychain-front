import {UserEntry} from "./UserEntry";
import {Meme} from "./Meme";
import {MemeComment} from "./MemeComment";

export interface MemeLinkInterface {
    id:string,
    order:number,
    on(callback: (meme: Meme) => void): () => void,
    refresh():Promise<string>
    getCommentVisitor():CommentsVisitor
}

export interface MemeLoaderInterface {
    on(callback: (memes: MemeLinkInterface[]) => void): () => void,
    loadMore(limit:number),
    refresh()
}

export interface MemeServiceAction {
    vote(memeID: string): Promise<string>,
    bet(memeID: string): Promise<string>,
    post(title:string,body:string):Promise<string>
}

export interface MemeServiceView {
    getMemeLoader(type:string,tags:string[]):MemeLoaderInterface
}

export interface MemeServiceInterface extends MemeServiceView{
    getMemeLink(id: string,order:number): MemeLinkInterface;
}

/**
 * COMMENT SERVICE
 */

export interface CommentsAction {
    postComment(parentPostId: string, message: string): Promise<string>;
}

export interface CommentsView {
    on(callback: (comments: MemeComment[]) => void): () => void;
    refresh():Promise<string>;
    loadMore(limit: number);
}

export interface CommentsVisitor extends CommentsView{}

export interface CommentServiceInterface {
    getCommentVisitor(id): CommentsVisitor
}

/**
 * AUTH USER SERVICE
 */
export interface UserActionInterface extends CommentsAction,MemeServiceAction{
}

/**
 * USER SERVICE
 */


export interface UserServiceInterface {
    loadUserData(uid: string): Promise<UserEntry>,
}

/**
 * File Upload Interface
 */

export interface FileUploadServiceInterface{
    uploadFile(file:File,progress:(progressPercent:number)=>void):Promise<UploadedDataInterface>
}

export interface UploadedDataInterface{
    fileURL:string,
    fileId:string,
}

