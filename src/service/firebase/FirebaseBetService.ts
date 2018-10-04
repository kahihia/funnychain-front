import * as firebase from "firebase";
import {DATABASE_BETS} from "./shared/FireBaseDBDefinition";

export class FirebaseBetService {
    dataBase = DATABASE_BETS;

    hasBetOnPost(memeId: string, uid: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            firebase.database().ref(this.dataBase + "/" + memeId).once("value", (data) => {
                let value: any[] = data.val();
                let userHasVoted = false;
                if(value!=null) {
                    Object.keys(value).forEach(userid => {
                        if (uid === userid) {
                            userHasVoted = true;
                        }
                    });
                }
                resolve(userHasVoted);
            });
        });
    }

    countBet(memeId: string): Promise<number> {
        return new Promise<number>(resolve => {
            firebase.database().ref(this.dataBase + "/" + memeId).once("value", (data) => {
                let value: any[] = data.val();
                if(value==null){
                    resolve(0);
                }else{
                    resolve(Object.keys(value).length);
                }
            }).catch(reason => {
                console.error(reason);
                resolve(0);
            });
        });
    }

    bet(memeId: string, uid: string): Promise<string> {
        return new Promise<string>(resolve => {
            firebase.database().ref(this.dataBase + '/' + memeId+"/"+uid).set(new Date().getTime()).then(() => {
                resolve("ok");
            });
        });
    }

}

export let firebaseBetService = new FirebaseBetService();
