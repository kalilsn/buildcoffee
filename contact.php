<?php 
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = str_replace(array("\r","\n"),array(" "," "), strip_tags(trim($_POST["name"])));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);
        $subject = str_replace(array("\r","\n"),array(" "," "), strip_tags(trim($_POST["subject"])));


        if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "Looks like something wasn't quite right. Make sure you use a valid email address and fill in all the required fields!";
            exit;
        }


        $to = "kalilsn@gmail.com";
        $subject = $subject ? $subject : "Hello Build!";

        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";

        $email_headers = "From: $name <$email>";

        if (mail($to, $subject, $email_content, $email_headers)) {
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