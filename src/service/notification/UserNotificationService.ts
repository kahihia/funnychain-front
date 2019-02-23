
import {UiNotification} from "./UiNotification";
import {OneSignalNotificationWebSDK} from "./OneSignalNotificationWebSDK";
import {ionicMobileAppService} from "../mobile/IonicMobileAppService";
import {OneSignalNotificationMobileSDK} from "./OneSignalNotificationMobileSDK";
import {GLOBAL_PROPERTIES} from "../../properties/properties";

export interface Message{
    text:string,
    type:string,
    date:number,
}

export class UserNotificationService {
    uiNotification:UiNotification;
    oneSignalNotification:any;//TODO interface

    start() {

        let API_KEY = GLOBAL_PROPERTIES.ONE_SIGNAL_API_KEY();
        let ANDROID_ID= GLOBAL_PROPERTIES.ONE_SIGNAL_ANDROID_NUMBER();

        this.uiNotification = new UiNotification();
        if(ionicMobileAppService.mobileapp){
            this.oneSignalNotification = new OneSignalNotificationMobileSDK(API_KEY,ANDROID_ID);
            this.oneSignalNotification.start();
        }else{
            this.oneSignalNotification = new OneSignalNotificationWebSDK(API_KEY);
            this.oneSignalNotification.start();
        }
        this.oneSignalNotification.onNewNotificationFromServiceWorker(data => {
            this.sendNotificationToUser(data.message);
        });
    }

    //ui part
    sendNotificationToUser(message:string):void {
        this.uiNotification.sendNotificationToUser({text: message, type: "text",date:new Date().getTime()});
    }

    sendNotificationMessageToUser(message:Message):void {
        this.uiNotification.sendNotificationToUser(message);
    }

    setUiCallBackForNotification(callback:(message:Message)=>void):void{
        this.uiNotification.setUiCallBackForNotification(callback);
    }

    //service worker server / app closed part
    updateNotification(uid: string):void {
        this.oneSignalNotification.updateNotification(uid);
    }

    onNotificationState(callback:(granted:boolean)=>void):()=>void{
        return this.oneSignalNotification.onNotificationState(callback);
    }

    setNotificationState(granted:boolean):void {
        this.oneSignalNotification.setNotificationState(granted);
    }
}

export let userNotificationService = new UserNotificationService();
