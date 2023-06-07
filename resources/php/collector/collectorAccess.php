<?php namespace collector;
    use Communication;
    use Debugg;
    require_once 'collector.php';
    require_once 'collectorPageViews.php';
    require_once 'collectorUserData.php';
    require_once 'collectorIP.php';

    switch(Communication::getAccess()){
        case "USEROBJ.GET"      : break;
        case "USEROBJ.EDIT"     : collectorUserOBJ::edit();break;

        case "PAGE.VIEWS.ADD"   : collectorPageViews::add(); break;
        case "PAGE.VIEWS.GET"   : collectorPageViews::get(); break;
        case "USER.NEW"         : collectorUserData::write(); break;
        case "USER.EDIT"        : collectorUserData::edit(); break;
        case "USER.CREATE"      : collectorUserData::create(); break;
        case "USER.GET"         : collectorUserData::get(); break;
        // case "USER.EDIT.PATH"   : collectorUserData::edit(); break;
        case "IP.WRITE"         : collectorIP::write(); break;
        default: Communication::sendBack("METHOD ERROR"); break;
    }