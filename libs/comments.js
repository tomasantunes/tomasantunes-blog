var nodemailer = require('nodemailer');

function sendCommentEmail(author, comment) {
  var smtpTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: secretConfig.SITE_EMAIL,
          pass: secretConfig.SITE_EMAIL_PASSWORD
      }
  });
  var mailOptions = {
      from: secretConfig.SITE_EMAIL,
      to: secretConfig.USER_EMAIL, 
      subject: 'New comment',
      text: "You have received the following comment: " + comment + " by " + author + "."
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Email has been sent successfully.");
      }
  });
}

function getChildrenComments(comments, parent_id) {
  var children = [];
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].parent_id == parent_id && comments[i].parent_id != 0) {
      children.push(comments[i]);
    }
  }
  return children;
}

module.exports = {
    sendCommentEmail,
    getChildrenComments,
    default: {
        sendCommentEmail,
        getChildrenComments
    }
};