<?PHP

@ob_start();
//session_start();

function checkLogin($returnURL) {
    $retURL = $returnURL;
    
    ?><script> var retURL='<?php echo $retURL;?>';</script><?php
    
    if ((!isset($_SESSION['userLogin'])) && ($_SESSION['userLogin'] == "")) {
        if (isset($_COOKIE['attESSec']) && isset($_COOKIE['attESHr'])) {
            $readCookie  = $_COOKIE['attESSec'];
            $readCookie  = $readCookie . "\r\n";
            $readCookie2 = $_COOKIE['attESHr'];
            $decript     = decryptCookie($readCookie);
            $decript     = trim($decript);
            
            if ($decript !== '' && $decript != "error") {
                $temtArrayECookie  = explode("|", $decript);
                $temtArrayHRCookie = explode("|", $readCookie2);
                $userName          = $temtArrayHRCookie[0] . " " . $temtArrayHRCookie[1];
                $userAttuid        = $temtArrayECookie[5];
                $userPrivileges    = $temtArrayECookie[4];
                $userManager       = $temtArrayHRCookie[5];
                
                $_SESSION['userLogin']      = $userAttuid;
                $_SESSION['userName']       = $userName;
                $_SESSION['userPrivileges'] = $userPrivileges;
                $_SESSION['userManager']    = $userManager;
                
                $returnValue = 1;
            } else // decript cookie is expired or empty
                {
                if ($decript == "error") {
                    printf("<script>alert('Authentication service is down contact lk6363@att.com')</script>");
                    printf("<script>location.href='http://netac.mt.att.com/storyteller2/index.php'</script>");
                }
                
                $returnValue = 0;
                $myWeb       = urlencode($returnURL);
                
                $gatePass = "https://www.e-access.att.com/empsvcs/hrpinmgt/pagLogin/?retURL=" . $myWeb . "&sysName=omqct";
                
                
                ?><script> var retURL='<?php echo $gatePass; ?>';</script><?php


                printf("<script>location.href=retURL</script>");
                
            }
            
        } else //if the cookie is not existing
            {
            $returnValue = 0;
            $myWeb       = urlencode($returnURL);
            
            $gatePass = "https://www.e-access.att.com/empsvcs/hrpinmgt/pagLogin/?retURL=" . $myWeb . "&sysName=omqct";

            ?><script> var retURL='<?php echo $gatePass;?>';</script><?php

            printf("<script>location.href=retURL</script>");
        }
        
    } else //if userLogin exists and not empty
        {
        $returnValue = 1;
    }
    
    return $returnValue;
    
} //end of function

function decryptCookie($rawCookie)
{
    
    $retVal = '';
    
    /* Get the port for the WWW service. */
    $service_port = 1500;
    
    /* Get the IP address for the target host. */
    $address = gethostbyname('localhost');
    
    /* Create a TCP/IP socket. */
    $socket = socket_create(AF_INET, SOCK_STREAM, 0);
    
    if ($socket < 0) {
        echo "socket_create() failed: reason: " . socket_strerror($socket) . "\n";
        return ('');
    }
    
    if ($result = socket_connect($socket, $address, $service_port)) {
    } else {
        $retVal = "error";
    }
    
    if ($result < 0) {
        echo "socket_connect() failed.\nReason: ($result) " . socket_strerror($result) . "\n";
        return ('');
    }
    
    $in  = $rawCookie;
    $out = '';
    
    socket_write($socket, $in, strlen($in));
    
    while ($out = socket_read($socket, 2048)) {
        
        $retVal = $retVal . $out;
    }
    
    socket_close($socket);
    return ($retVal);
}