$(document).ready(function()
{
    //Validation for new account creation
    window.checkNewAccountEntry = function()
    {

        var isValid = true;
        $('#error-list').empty();

        if($('#password').val() !== $('#password-repeat').val())
        {
        
            
            $('#error-list').append('<li>You must enter the same password twice!</li>');        
            isValid = false;
        }

        
        return isValid;

        
    

    
    } 

}
);
