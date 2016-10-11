<?php 
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = str_replace(array("\r","\n"),array(" "," "), strip_tags(trim($_POST["name"])));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);
        $subject = str_replace(array("\r","\n"),array(" "," "), strip_tags(trim($_POST["subject"])));


        # Recaptcha verification
        $content = [
            'secret' => '6Lf1xQgUAAAAABRD04M61uerCod3xW9jp-RfKlgV',
            'response' => $_POST['g-recaptcha-response'],
            'remoteip' => $_SERVER['REMOTE_ADDR']
        ];

        $url = 'https://www.google.com/recaptcha/api/siteverify';

        $opts = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($content) 
            ]
        ];

        $context = stream_context_create($opts);
        $response = file_get_contents($url, false, $context);
        $captcha = json_decode($response)->success;

        if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL) OR !$captcha) {
            http_response_code(400);
            echo "Looks like something wasn't quite right. Make sure you use a valid email address and fill in all the required fields!";
            exit;
        }


        $to = "info@buildcoffee.org";
        $subject = $subject ? $subject : "Hello Build!";

        $email_headers = "From: $name <$email>";

        if (mail($to, $subject, $message, $email_headers)) {
            http_response_code(200);
            echo "Thank you! We'll do our best to get back to you ASAP.";
        } else {
            http_response_code(500);
        }

    } else {
        http_response_code(403);
        echo "That's not what this is for.";
    }

?>