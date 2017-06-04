<?PHP

        session_start();       // Browser session start
        include 'gl_gate.php'; // Connection details for GL auth.

        // If userName is not set, ie user is not logged in
        if(!isset($_SESSION['userName'])) {
                //$retURL="http://netac.mt.att.com/storyteller2/index.php";  // Save the 'Home' Page in a variable
                $retURL = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

                if((checkLogin($retURL))==0){ // If user is not logged in, send them to home page to trigger Global Login
                        //printf("<script>location.href='http://netac.mt.att.com/storyteller2/index.php'</script>");
                        printf("<script>location.href='$retURL'</script>");
                }

                /**
                * Save those variables that will be used from the current session
                */
                $name=$_SESSION['userName'];
                $attuid=$_SESSION['userLogin'];
                // $attmgr=$_SESSION['userManager'];

        }else {  // User logged in, save needed variables
                

                $name=$_SESSION['userName'];
                $attuid=$_SESSION['userLogin'];
                // $attmgr=$_SESSION['userManager'];
        }
?>
