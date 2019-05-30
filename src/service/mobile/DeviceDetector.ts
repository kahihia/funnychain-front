import MobileDetect from "mobile-detect";
import {pwaService} from "./PWAService";
import {isBrowserRenderMode} from "../ssr/windowHelper";

export class DeviceDetector {
    private type: string;
    private os: string;
    private md: MobileDetect;
    private useragent: string;
    //windows chrome
    //android chrome
    //android pwa
    //android mobile
    //[OS] [viewer] [version]
    //OS: Windows/Mac/Linux/Ios/android
    //viewer PWA/browser/Mobile app

    start(ua:string){
        this.useragent = ua;
        this.md = new MobileDetect(this.useragent);
        this.os = this.md.os() ? this.md.os() : "desktop";
        this.type = "";
        if ((this.os === "iOS" && this.isIosMobileApp()) || (this.os === "AndroidOS" && this.isAndroidMobileApp())) {
            this.type = "mobile";
        } else if (pwaService.runningFromPWA) {
            this.type = "pwa"
        } else {
            this.type = "web";
        }
    }

    isServerRender():boolean{
        return !isBrowserRenderMode();
    }


    getUserAgent(){
        return  this.useragent;
    }

    hasNotch(){
        return this.isIphoneX();
    }

    isAndroidMobileApp(){
        //wv == webview
        return this.getUserAgent().indexOf('wv') > -1;//contains wv
    }

    isIosMobileApp(){
        //let iOSApp = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        let iOSApp = (/iPad|iPhone|iPod/.test(this.getUserAgent()));//contains iphone etc...
        //let iOSApp = navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 ;
        iOSApp = iOSApp && this.getUserAgent().indexOf('Safari') == -1;//do not contains Safari
        return iOSApp;
    }

    isIphoneX(){
        /**
         Screen Resolution: 375 x 812 (pixels)
         Browser Dimensions: 980 x 1956 (pixels)
         Screen Resolution: 375 x 812 (pixels)
         Browser Dimensions: 980 x 448 (pixels)

         iPhone XS Max	1242px × 2688px	2688px × 1242px => 414 x 896
         iPhone XS	1125px × 2436px	2436px × 1125px => 375 x 812
         iPhone XR	828px × 1792px	1792px × 828px => 276 x 597 ou 598
         iPhone X	1125px × 2436px	2436px × 1125px

         //https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
         1125 x 2436         375 x 812         3.0         3.0
         * */
        return this.isIPhone() && (
            (screen.width==375 && screen.height==812) || //Iphone X Iphone XS
            (screen.width==375 && (screen.height==597 || screen.height==598)) || //iPhone XR
            (screen.width==414 && screen.height==896)    //iPhone XS Max
        )
    }

    getDeviceString():string{
        return this.os+"/"+this.type+(this.isServerRender()?"/server_render":"");
    }

    /**
     * Mobile app only
     */
    isMobileAppRender():boolean{
        return this.type === "mobile";
    }

    isMobileRender():boolean{
        //if mobile detector detect something it means that this is a mobile device (touch capable etc...)
        return this.md.os()?true:false;
    }

    isAndroid():boolean{
        return this.os === "AndroidOS";
    }

    isIPhone():boolean{
        return this.os === "iOS";
    }

    isSafari():boolean{
        let ua = this.getUserAgent();
        if (ua.indexOf('Ios') != -1 || ua.indexOf('Safari') != -1) {
            if (ua.indexOf('chrome') > -1 || ua.indexOf('Chrome') > -1) {
                return false; // Chrome
            } else {
                return true; // Safari
            }
        }
        return false;
    }

    isIphoneAndMobileApp():boolean{
        return this.isMobileAppRender()&&this.isIPhone();
    }

    isAndroidAndMobileApp():boolean{
        return this.isMobileAppRender()&&this.isAndroid();
    }
}

export let deviceDetector = new DeviceDetector();